import CTA from "../components/landing/CTA";
import Features from "../components/landing/Features";
import Properties from "../components/landing/Properties";
import Roadmap from "../components/landing/Roadmap";
import type { NextPage } from "next";
import Hero from "~~/components/landing/Hero";

const Home: NextPage = () => {
  return (
    <>
      <Hero />
      <Features />
      <Properties />
      <Roadmap />
      <CTA />
    </>
  );
};

export default Home;
