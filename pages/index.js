import React, { useEffect } from "react";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import Layout from "src/components/Layout";
import SectionList from "src/components/SectionList";
import Footer from "src/components/Footer";
import { interests } from "src/data/interests";
import { getAllCourses } from "redux/slice/course";

export default function Home() {
  const dispatch = useDispatch();
  const { isAuthenticated, profile } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getAllCourses());
  }, [dispatch]);

  const renderHero = () => {
    return (
      <div className="relative min-h-screen bg-bodyBg overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 animate-gradient"></div>
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-glow bg-primary/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 6 + 2}px`,
                height: `${Math.random() * 6 + 2}px`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-6 pt-32 pb-20 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col md:flex-row items-center justify-between gap-16"
          >
            <div className="md:w-1/2">
              <motion.h1
                className="font-comedik text-6xl md:text-7xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
              >
                Unlock Your Creative Potential
              </motion.h1>
              <motion.p
                className="font-comedik text-xl text-secondaryText mb-12"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                Join our immersive learning experience and transform your
                journey into an adventure of discovery.
              </motion.p>
              <motion.div
                className="flex gap-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                <a
                  href="#courses"
                  className="font-comedik bg-primary text-white px-8 py-4 rounded-xl hover:bg-primary/90 transition-all transform hover:scale-105"
                >
                  Start Learning
                </a>
                <a
                  href="#about"
                  className="font-comedik border-2 border-primary text-primary px-8 py-4 rounded-xl hover:bg-primary/10 transition-all transform hover:scale-105"
                >
                  Explore More
                </a>
              </motion.div>
            </div>

            <motion.div
              className="md:w-1/2 animate-float"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <Image
                src="/assets/3d-icon.png"
                alt="Learning Illustration"
                width={600}
                height={500}
                className="rounded-2xl"
                priority
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    );
  };

  const renderFeatures = () => {
    const features = [
      {
        icon: "🚀",
        title: "Interactive Learning",
        description:
          "Immerse yourself in hands-on projects and real-world applications",
      },
      {
        icon: "✨",
        title: "Creative Freedom",
        description:
          "Express yourself through unique projects and innovative solutions",
      },
      {
        icon: "🎯",
        title: "Guided Journey",
        description:
          "Follow a structured path while maintaining your creative independence",
      },
    ];

    return (
      <div className="py-32 bg-tertiaryBg">
        <div className="container mx-auto px-6">
          <motion.h2
            className="font-comedik text-4xl text-center mb-16 text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Embrace the Future of Learning
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-12">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                className="bg-bodyBg p-8 rounded-2xl hover:transform hover:scale-105 transition-all duration-300"
              >
                <div className="text-5xl mb-6">{feature.icon}</div>
                <h3 className="font-comedik text-2xl mb-4 text-primary">
                  {feature.title}
                </h3>
                <p className="text-secondaryText">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderCourses = () => {
    if (!isAuthenticated) {
      return interests.map((category) =>
        category.subCategories.map((subCategory) => (
          <SectionList
            key={`${category.slug}-${subCategory.slug}`}
            interest={{
              type: "category",
              title: category.title,
              slug: category.slug,
              subCategory: subCategory.slug,
            }}
          />
        )),
      );
    }

    if (isAuthenticated && profile.interests.length) {
      return profile.interests.map((interest, i) => (
        <SectionList interest={interest} key={i} />
      ));
    }
  };

  return (
    <>
      <Layout>
        {renderHero()}
        {renderFeatures()}
        <div className="px-10 xl:px-20 py-20 bg-bodyBg" id="courses">
          {renderCourses()}
        </div>
      </Layout>
      <Footer />
    </>
  );
}
