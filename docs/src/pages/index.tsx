import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          CropCare
        </Heading>
        <p className="hero__subtitle">Empowering Farmers with AI Chatbot Assistance</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/intro">
            Get Started - 5min ⏱️
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`Welcome to ${siteConfig.title}`}
      description="Empowering Farmers with AI Chatbot Assistance for plant disease identification and farming needs.">
      <HomepageHeader />
      <main>
        <section className={styles.features}>
          <div className="container">
            <div className="row">
              <div className={clsx('col col--6')}>
                <div className="padding-horiz--md">
                  <Heading as="h3" className="text--center">Empowering Farmers with AI: Discover the Future of Farming Assistance</Heading>
                  <p className="text--center">Our AI assistant chatbot revolutionizes farming practices by providing real-time support and accurate plant disease identification.</p>
                  <ul className={styles.featureList}>
                    <li>Real-time disease identification for healthier crops</li>
                    <li>Optimize your farming practices with AI-powered insights</li>
                    <li>Expert farming advice at your fingertips</li>
                  </ul>
                </div>
              </div>
              <div className={clsx('col col--6')}>
                <div className="text--center">
                  <img src="/img/undraw_docusaurus_tree.svg" alt="Farming Assistance" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.features}>
          <div className="container">
            <div className="row">
              <div className={clsx('col col--6')}>
                <div className="text--center">
                  <img src="/img/undraw_docusaurus_react.svg" alt="Key Features" />
                </div>
              </div>
              <div className={clsx('col col--6')}>
                <div className="padding-horiz--md">
                  <Heading as="h3" className="text--center">Key Features</Heading>
                  <ul className={styles.featureList}>
                    <li>Plant disease identification</li>
                    <li>Farming assistance</li>
                    <li>Expert advice</li>
                    <li>Market insights</li>
                    <li>Government schemes</li>
                    <li>Weather updates</li>
                    <li>Community forum</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}