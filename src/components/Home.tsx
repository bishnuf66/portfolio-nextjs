import React from "react";
import { Typewriter } from "react-simple-typewriter";
import useStore from "@/store/store";

const Home = () => {
  const { isDarkMode } = useStore();
  return (
    <div
      className={`min-h-screen flex flex-col justify-center items-center p-8 ${
        isDarkMode ? "text-white" : "text-black"
      }`}
    >
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            <Typewriter
              words={["Welcome to My Digital Space!"]}
              loop={1}
              cursor
              cursorStyle="_"
              typeSpeed={70}
              deleteSpeed={50}
              delaySpeed={1000}
            />
          </h1>

          <p className="text-xl leading-relaxed text-gray-600 dark:text-gray-300">
            Hello! I'm Bishnu, a passionate Fullstack Developer crafting digital
            experiences that blend creativity with functionality. I believe in
            building solutions that not only work flawlessly but also tell a
            story.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="p-6 rounded-xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-2xl font-bold mb-4 text-blue-600 dark:text-blue-400">
              <Typewriter
                words={["My Journey"]}
                loop={1}
                cursor
                cursorStyle="_"
                typeSpeed={70}
                deleteSpeed={50}
                delaySpeed={1000}
              />
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              From lines of code to impactful applications, my journey has been
              about transforming ideas into reality. Each project is a new
              chapter in my story of growth and innovation.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-2xl font-bold mb-4 text-purple-600 dark:text-purple-400">
              <Typewriter
                words={["My Approach"]}
                loop={1}
                cursor
                cursorStyle="_"
                typeSpeed={70}
                deleteSpeed={50}
                delaySpeed={1000}
              />
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              I combine technical expertise with creative problem-solving to
              build applications that are not just functional, but also
              delightful to use. Every project is an opportunity to push
              boundaries and create something extraordinary.
            </p>
          </div>
        </div>

        <div className="mt-12 text-center">
          <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">
            <Typewriter
              words={["What I Bring to the Table"]}
              loop={1}
              cursor
              cursorStyle="_"
              typeSpeed={70}
              deleteSpeed={50}
              delaySpeed={1000}
            />
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-4 rounded-lg bg-white dark:bg-gray-800 shadow-md">
              <h3 className="text-xl font-semibold mb-2 text-blue-600 dark:text-blue-400">
                Innovation
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Pushing boundaries with cutting-edge technologies
              </p>
            </div>
            <div className="p-4 rounded-lg bg-white dark:bg-gray-800 shadow-md">
              <h3 className="text-xl font-semibold mb-2 text-purple-600 dark:text-purple-400">
                Precision
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Meticulous attention to detail in every project
              </p>
            </div>
            <div className="p-4 rounded-lg bg-white dark:bg-gray-800 shadow-md">
              <h3 className="text-xl font-semibold mb-2 text-green-600 dark:text-green-400">
                Passion
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Driven by the love for creating exceptional experiences
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
