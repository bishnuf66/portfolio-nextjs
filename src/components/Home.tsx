import React from "react";
import { Typewriter } from "react-simple-typewriter";
import useStore from "@/store/store";

const Home = () => {
  const { isDarkMode } = useStore();
  return (
    <div className={`p-4 ${isDarkMode ? "text-white" : "text-black"}`}>
      <h1 className="text-2xl font-bold mb-4">
        <Typewriter
          words={["Welcome to My Portfolio!"]}
          loop={1}
          cursor
          cursorStyle="_"
          typeSpeed={70}
          deleteSpeed={50}
          delaySpeed={1000}
        />
      </h1>

      <p className="mb-4">
        "Hello and welcome! I'm Bishnu, a passionate Fullstack Web Developer
        with a knack for creating robust, scalable web applications. Here,
        you'll find a showcase of my journey, projects I've built, and
        technologies I'm proficient in."
      </p>
      <h2 className="text-2xl font-bold mb-4">
        <Typewriter
          words={["What You'll Discover:"]}
          loop={1}
          cursor
          cursorStyle="_"
          typeSpeed={70}
          deleteSpeed={50}
          delaySpeed={1000}
        />
      </h2>

      <p className="mb-2">
        Professional Projects: Explore a collection of projects I've crafted
        from ideation to deployment, leveraging technologies such as React,
        Nextjs, Node.js, etc.
      </p>

      <p className="mb-2">
        {" "}
        Skills & Expertise: Dive into my proficiency in frontend development
        (HTML/CSS, JavaScript, React, Nextjs), backend development (Node.js,
        Express), database management (SQL, NoSQL), and more.
      </p>

      <p className="mb-2">
        {" "}
        Passion for Problem-Solving: I thrive on solving complex problems and
        delivering intuitive solutions that enhance user experiences and drive
        business growth.
      </p>
    </div>
  );
};

export default Home;
