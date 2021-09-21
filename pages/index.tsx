import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import styles from "../styles/home.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGithub,
  faTwitter,
  faLinkedin,
  faJsSquare,
  faDocker,
  faHtml5,
  faBitbucket,
  faBootstrap,
  faCss3Alt,
  faDigitalOcean,
  faFigma,
  faGit,
  faGithubSquare,
  faNode,
  faNpm,
  faPhp,
  faPython,
  faReact,
  faSass,
  faYarn,
} from "@fortawesome/free-brands-svg-icons";
import path from "path";
import { promises as fs } from "fs";
import Nav from "../components/nav";
import Footer from "../components/footer";

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Matthew Volk</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.container}>
        <Nav />
        <div className={styles.hero}>
          <div className={styles.heroTitle}>Hi.</div>
          <div className={styles.heroText}>
            My name is Matt and I&apos;m a software developer living in Austin,
            TX. I&apos;m currently working at BigCommerce, a NASDAQ-listed
            ecommerce platform that provides a software as a service product to
            retailers.
          </div>
          <div className={styles.heroIcons}>
            <a
              href="https://github.com/matthewvolk"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FontAwesomeIcon className={styles.heroIcon} icon={faGithub} />
            </a>
            <a
              href="https://twitter.com/volkmatt"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FontAwesomeIcon className={styles.heroIcon} icon={faLinkedin} />
            </a>
            <a
              href="https://twitter.com/volkmatt"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FontAwesomeIcon className={styles.heroIcon} icon={faTwitter} />
            </a>
          </div>
        </div>
        <div className={styles.projectSection}>
          <h2>Projects</h2>
          <div className={styles.projects}>
            <a
              href="https://www.npmjs.com/package/bigreq"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className={styles.project}>
                <h3 className={styles.projectTitle}>BigReq</h3>
                <p className={styles.projectDescription}>
                  Node.js HTTP Request Library for BigCommerce
                </p>
                <div className={styles.tags}>
                  <p className={styles.tag}>nodejs</p>
                  <p className={styles.tag}>npm</p>
                  <p className={styles.tag}>http</p>
                  <p className={styles.tag}>cli</p>
                </div>
              </div>
            </a>
            <a
              href="https://github.com/matthewvolk/calendarnotes"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className={styles.project}>
                <h3 className={styles.projectTitle}>CalendarNotes</h3>
                <p className={styles.projectDescription}>
                  Small web application to generate meeting notes for your
                  calendar events
                </p>
                <div className={styles.tags}>
                  <p className={styles.tag}>expressjs</p>
                  <p className={styles.tag}>nextjs</p>
                  <p className={styles.tag}>oauth</p>
                  <p className={styles.tag}>docker</p>
                </div>
              </div>
            </a>
          </div>
        </div>
        <div className={styles.techSection}>
          <h2>Technologies</h2>
          <div className={styles.techIcons}>
            <FontAwesomeIcon className={styles.icon} icon={faHtml5} />
            <FontAwesomeIcon className={styles.icon} icon={faCss3Alt} />
            <FontAwesomeIcon className={styles.icon} icon={faJsSquare} />
            <FontAwesomeIcon className={styles.icon} icon={faNode} />
            <FontAwesomeIcon className={styles.icon} icon={faNpm} />
            <FontAwesomeIcon className={styles.icon} icon={faPhp} />
            <FontAwesomeIcon className={styles.icon} icon={faPython} />
            <FontAwesomeIcon className={styles.icon} icon={faYarn} />
            <FontAwesomeIcon className={styles.icon} icon={faSass} />
            <FontAwesomeIcon className={styles.icon} icon={faReact} />
            <FontAwesomeIcon className={styles.icon} icon={faBootstrap} />
            <FontAwesomeIcon className={styles.icon} icon={faGit} />
            <FontAwesomeIcon className={styles.icon} icon={faGithubSquare} />
            <FontAwesomeIcon className={styles.icon} icon={faBitbucket} />
            <FontAwesomeIcon className={styles.icon} icon={faDocker} />
            <FontAwesomeIcon className={styles.icon} icon={faDigitalOcean} />
            <FontAwesomeIcon className={styles.icon} icon={faFigma} />
          </div>
        </div>
        <Footer />
      </main>
    </div>
  );
};

export async function getStaticProps() {
  const blogDirectory = path.join(process.cwd(), "_posts");
  const blogFileNames = await fs.readdir(blogDirectory);

  return {
    props: {},
  };
}

export default Home;
