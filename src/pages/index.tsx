import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

import { Button } from "~/components/Button";
import FormInput from "~/components/Forms/FormInput";
import FeaturesPoint from "~/components/HomePage/FeaturesPoint";
import ExploreImage from "~/components/Images/ExploreImage";

const Home: NextPage = () => {
  return (
    <>
      <Head key={"home"}>
        <title>CodeMart</title>
        <meta
          name="description"
          content="Marketplace for selling source code"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <>
        <section
          id="hero"
          className="my-16 flex flex-row items-center justify-center px-4 md:my-32 lg:justify-between lg:px-16"
        >
          <div
            id="hero-tagline"
            className="flex max-w-xl flex-col gap-y-6 md:gap-y-12"
          >
            <div id="hero-text">
              <h1 className="text-3xl font-bold !leading-snug md:text-4xl lg:text-5xl">
                Explore <span className="text-codemart-600">Source Code</span>{" "}
                for your Business{" "}
                <span className="text-codemart-600">Needs</span>
              </h1>

              <p className="mt-4 max-w-lg text-gray-900">
                CodeMart is Source Code marketplace that allow Developer post
                their works and Customer to buy Developer code based on their
                needs and requirements.
              </p>
            </div>
            <div
              id="hero-cta"
              className="col-span-2 grid w-full grid-flow-row gap-y-6 md:grid-flow-col md:gap-x-12"
            >
              <Link href="/products">
                <Button>Buy a Source Code</Button>
              </Link>
              <Link href="/products/sell">
                <Button style="outline">I&apos;m a Developer</Button>
              </Link>
            </div>
          </div>
          <div id="hero-image" className="hidden lg:block">
            <ExploreImage />
          </div>
        </section>

        <section
          id="features"
          className="mx-auto flex flex-col gap-y-12 px-2 lg:px-16"
        >
          <h2 className="text-center text-3xl font-semibold md:text-4xl">
            We&apos;re here to Help
          </h2>
          <div className="grid grid-flow-row gap-y-6 md:grid-flow-col md:gap-y-0 md:gap-x-8">
            <FeaturesPoint
              title="Explore Source Code"
              description="Explore Source Code from our marketplace and find the best one for your business needs."
              icon="Src"
            />

            <FeaturesPoint
              title="Browse Source Code"
              description="Find source code that suit with your needs by browsing posted source code by developer."
              icon="Search"
            />

            <FeaturesPoint
              title="Pay Safely"
              description="Our payment system is using trusted Payment Gateway Midtrans."
              icon="Safe"
            />

            <FeaturesPoint
              title="Chat With Developer"
              description="We provide communication service for developer and customer that allow to communicate each other."
              icon="Chat"
            />
          </div>
        </section>

        <section
          id="contact-us"
          className="mx-auto my-32 flex max-w-6xl flex-col items-center justify-between gap-y-6 text-center lg:flex-row lg:px-16 lg:text-left"
        >
          <div>
            <h3 className="text-2xl font-semibold md:text-4xl">
              Stay in Touch with Us
            </h3>
            <br />
            <p className="text-recandy-gray-900">
              Ask us question so we can help you
            </p>
          </div>

          <form className="flex w-full max-w-sm flex-col space-y-4 rounded-md bg-white px-8 py-12 drop-shadow-xl">
            <FormInput placeholder={"Full Name"} />
            <FormInput placeholder={"Email"} />
            <FormInput placeholder={"Phone Number"} />
            <FormInput placeholder={"Subject"} />
            <Button>Submit</Button>
          </form>
        </section>
      </>
    </>
  );
};

export default Home;
