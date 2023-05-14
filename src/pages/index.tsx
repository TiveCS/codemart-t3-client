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
          className="my-32 flex flex-row items-center justify-between px-32"
        >
          <div id="hero-tagline" className="flex max-w-xl flex-col gap-y-12">
            <div id="hero-text">
              <h1 className="text-5xl font-bold !leading-snug">
                Explore <span className="text-codemart-600">Source Code</span>{" "}
                for your Business{" "}
                <span className="text-codemart-600">Needs</span>
              </h1>

              <p className="max-w-lg text-gray-900">
                CodeMart is Source Code marketplace that allow Developer post
                their works and Customer to buy Developer code based on their
                needs and requirements.
              </p>
            </div>
            <div
              id="hero-cta"
              className="col-span-2 grid w-full grid-flow-col gap-x-12"
            >
              <Link href="/products">
                <Button>Buy a Source Code</Button>
              </Link>
              <Link href="/products/sell">
                <Button style="outline">I&apos;m a Developer</Button>
              </Link>
            </div>
          </div>
          <div id="hero-image">
            <ExploreImage />
          </div>
        </section>

        <section
          id="features"
          className="flex flex-col items-center justify-center space-y-16 pl-32 pr-16 pt-16 pb-24"
        >
          <h2 className="text-center text-4xl font-semibold">
            We&apos;re here to Help
          </h2>
          <div className="flex flex-row space-x-8">
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
          className="flex flex-row items-center justify-between py-32 pl-32 pr-48"
        >
          <div>
            <h3 className="text-4xl font-semibold">Stay in Touch with Us</h3>
            <br />
            <p className="text-recandy-gray-900">
              Ask us question so we can help you
            </p>
          </div>

          <form
            action=""
            className="flex w-1/3 flex-col space-y-4 rounded-md bg-white px-8 py-12 drop-shadow-xl"
          >
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
