// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

// Import necessary OpenZeppelin contracts for NFT functionality, access control, and upgradeability
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

// Interface for interaction with the marketplace contracts
interface IMarketplace {
    function createProperty(address lister, uint256 _tokenId, uint256 _price) external;
    function createProperty(address lister, uint256 _tokenId, uint256 _price, bool _canBid) external;
}

/**
 * @title PropertyNFT
 * @dev A smart contract for tokenizing real estate properties as NFTs
 * Supports both full property ownership and fractional ownership
 * Implements upgradeable pattern and role-based access control
 */
contract PropertyNFT is
    Initializable,
    ERC721Upgradeable,
    ERC721EnumerableUpgradeable,
    ERC721URIStorageUpgradeable,
    ERC721PausableUpgradeable,
    AccessControlUpgradeable,
    Ownable
{
    // Marketplace contract interfaces for regular and fractional properties
    IMarketplace public marketplace;
    IMarketplace public fractionalMarketplace;

    // Token ID counters - separate ranges for regular and fractional properties
    uint256 private _nextTokenId; // Starts from 1
    uint256 private _nextFracTokenId; // Starts from 10000001
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    // Enum to define different types of properties
    enum PropertyType {
        UNDEFINED,
        APARTMENT,
        HOUSE
    }

    // Structure to store property characteristics
    struct Feature {
        PropertyType propertyType;
        string physicalAddress;
        uint256 rooms;
        uint256 bathrooms;
        uint256 area;
    }

    // Mappings to store property features and blacklisted addresses
    mapping(uint256 => Feature) public propertyFeature;
    mapping(address => bool) private _blacklist;

    // Events for tracking important contract actions
    event Minted(address to, uint256 tokenId);
    event BatchMinted(address to, uint256[] tokenId);
    event Burned(address user, uint256 tokenId);
    event BatchBurned(uint256[] tokenId);

    /**
     * @dev Initializes the contract with basic settings
     * Sets up the NFT name, symbol, and grants initial roles
     */
    function initialize() external initializer {
        __ERC721_init("Estate PropertyNFT", "EPNFT");
        __Ownable_init(msg.sender);
        __ERC721Enumerable_init();
        __ERC721URIStorage_init();
        __ERC721Pausable_init();
        __AccessControl_init();

        _nextTokenId = 1;
        _nextFracTokenId = 10000001;
        _grantRole(DEFAULT_ADMIN_ROLE, owner());
        _grantRole(MINTER_ROLE, owner());
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    /**
     * @dev Creates a new property NFT with full ownership
     * @param price The listing price of the property
     * @param canBid Whether the property can receive bids
     * @param propertyType Type of property (APARTMENT, HOUSE)
     * @param physicalAddress Physical location of the property
     * @param rooms Number of rooms
     * @param bathrooms Number of bathrooms
     * @param area Size of the property in square meters
     */
    function createProperty(
        uint256 price,
        bool canBid,
        PropertyType propertyType,
        string memory physicalAddress,
        uint256 rooms,
        uint256 bathrooms,
        uint256 area // Area in sqm
    ) public {
        uint256 tokenId = _nextTokenId++;
        _safeMint(address(marketplace), tokenId);
        marketplace.createProperty(msg.sender, tokenId, price, canBid);
        propertyFeature[tokenId] = Feature(propertyType, physicalAddress, rooms, bathrooms, area);
        emit Minted(msg.sender, tokenId);
    }

    /**
     * @dev Creates a new property NFT for fractional ownership
     * Similar to createProperty but uses different token ID range and marketplace
     */
    function createPropertyShared(
        uint256 price,
        PropertyType propertyType,
        string memory physicalAddress,
        uint256 rooms,
        uint256 bathrooms,
        uint256 area // Area in sqm
    ) public {
        uint256 tokenId = _nextFracTokenId++;
        _safeMint(address(fractionalMarketplace), tokenId);
        fractionalMarketplace.createProperty(msg.sender, tokenId, price);
        propertyFeature[tokenId] = Feature(propertyType, physicalAddress, rooms, bathrooms, area);
        emit Minted(msg.sender, tokenId);
    }

    function burn(uint256 tokenId) public {
        require(hasRole(MINTER_ROLE, msg.sender));
        address user = ownerOf(tokenId);
        _update(address(0), tokenId, user);
        emit Burned(user, tokenId);
    }

    function burnBatch(uint256[] memory tokenIds) public {
        require(hasRole(MINTER_ROLE, msg.sender));
        for (uint256 i = 0; i < tokenIds.length; i++) {
            address user = ownerOf(tokenIds[i]);
            _update(address(0), tokenIds[i], user);
        }
        emit BatchBurned(tokenIds);
    }

    /**
     * @dev Returns all token IDs owned by a specific address
     * @param _account The address to query
     * @return Array of token IDs owned by the address
     * @notice May be gas intensive for addresses with many tokens
     */
    function tokensByAddress(address _account) external view returns (uint256[] memory) {
        uint256 tokenCount = balanceOf(_account);
        uint256[] memory tokenIDs = new uint256[](tokenCount);
        for (uint256 i = 0; i < tokenCount; i++) {
            tokenIDs[i] = tokenOfOwnerByIndex(_account, i);
        }
        return tokenIDs;
    }

    function setTokenURI(uint256 tokenId, string memory _tokenURI) public {
        require(hasRole(MINTER_ROLE, msg.sender));
        _setTokenURI(tokenId, _tokenURI);
    }

    /**
     * @dev Internal function to handle token transfers
     * Ensures transfers only occur through approved marketplace contracts
     * and prevents blacklisted addresses from participating
     */
    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal override(ERC721Upgradeable, ERC721EnumerableUpgradeable, ERC721PausableUpgradeable) returns (address) {
        require(!_blacklist[auth], "_update: Sender is blacklisted");
        require(!_blacklist[to], "_update: Recipient is blacklisted");
        require(
            auth == address(marketplace) ||
                to == address(marketplace) ||
                auth == address(fractionalMarketplace) ||
                to == address(fractionalMarketplace),
            "_update: Not allowed to transfer this NFT"
        );
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(
        address account,
        uint128 value
    ) internal override(ERC721Upgradeable, ERC721EnumerableUpgradeable) {
        super._increaseBalance(account, value);
    }

    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721Upgradeable, ERC721URIStorageUpgradeable) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function grantMinterRole(address _minter) public onlyOwner {
        _grantRole(MINTER_ROLE, _minter);
    }

    function isBlackListed(address _account) external view returns (bool) {
        return _blacklist[_account];
    }

    /**
     * @dev Blacklist management functions
     * Allows owner to restrict specific addresses from participating
     */
    function addToBlacklist(address _account) external onlyOwner {
        require(!_blacklist[_account], "Address is already blacklisted");
        _blacklist[_account] = true;
    }

    function removeFromBlacklist(address _account) external onlyOwner {
        require(_blacklist[_account], "Address is not blacklisted");
        _blacklist[_account] = false;
    }

    function getNextTokenId() external view returns (uint256) {
        return _nextTokenId;
    }

    function setMarketplaceAddress(address _marketAddress) external onlyOwner {
        marketplace = Imarketplace(_marketAddress);
    }

    function setFractionalMarketplace(address _marketAddress) external onlyOwner {
        fractionalMarketplace = IMarketplace(_marketAddress);
    }

    // Standard override functions for compatibility with OpenZeppelin contracts
    function supportsInterface(
        bytes4 interfaceId
    )
        public
        view
        override(ERC721Upgradeable, ERC721EnumerableUpgradeable, ERC721URIStorageUpgradeable, AccessControlUpgradeable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
