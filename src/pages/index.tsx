import { GetStaticProps } from "next";
import Head from "next/head";
import Image from "next/image";
import { SubscribeButton } from "../components/SubscribeButton";
import { stripe } from "../services/stripe";
import styles from "./home.module.scss";
import girl_coding from "../../public/images/avatar.svg";

interface HomeProps {
  product: {
    priceId: string;
    amount: string;
    recurringInterval: string;
  };
}

export default function Home({ product }: HomeProps) {
  return (
    <>
      <Head>
        <title>Home | ig.news</title>
      </Head>
      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>👏 Hey, welcome!</span>
          <h1>
            News about the <span>React</span> world
          </h1>
          <p>
            Get access to all the publications <br />
            <span>
              for {product.amount}/{product.recurringInterval}
            </span>
          </p>
          <SubscribeButton />
        </section>

        <Image src={girl_coding} alt="Girl coding" height={521} width={336} />
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const price = await stripe.prices.retrieve("price_1JViQ7JUzhFkiU8NFoTF44UQ");

  const product = {
    priceId: price.id,
    recurringInterval: price.recurring.interval,
    amount: new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(
      price.unit_amount / 100 // api retorna em centavos
    ),
  };

  return {
    props: { product },
    revalidate: 60 * 60 * 24, // 24 horas
  };
};
