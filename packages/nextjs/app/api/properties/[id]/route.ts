import { NextResponse } from "next/server";
import { prisma } from "~~/lib/prisma";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const property = await prisma.properties.findUnique({
      where: {
        tokenId: params.id,
      },
    });

    if (!property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 });
    }

    return NextResponse.json(property);
  } catch (error) {
    console.error("Error fetching property:", error);
    return NextResponse.json({ error: "Error fetching property" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    // First, get the current property data
    const currentProperty = await prisma.properties.findUnique({
      where: { tokenId: params.id },
    });

    if (!currentProperty) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 });
    }

    const body = await request.json();

    // Merge the existing properties with the updated fields
    const updatedProperties = {
      ...(currentProperty.properties as any), // Cast to any to avoid TS issues with dynamic properties
      ...body, // This will merge all fields from the request body
    };

    // Update the property with merged data
    const property = await prisma.properties.update({
      where: { tokenId: params.id },
      data: {
        properties: updatedProperties,
      },
    });

    return NextResponse.json(property);
  } catch (error) {
    console.error("Error updating property:", error);
    return NextResponse.json({ error: "Error updating property" }, { status: 500 });
  }
}
