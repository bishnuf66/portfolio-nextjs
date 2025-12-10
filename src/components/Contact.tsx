"use client";

import React, { useState } from "react";
import { send } from "emailjs-com";
import useStore from "@/store/store";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Mail, Send, User, MessageSquare, Linkedin, Github } from "lucide-react";
import { BackgroundGradient } from "@/components/ui/BackgroundGradient";
import { MovingBorder } from "@/components/ui/MovingBorder";

const Contact = () => {
  const { isDarkMode } = useStore();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!formData.name || !formData.email || !formData.message) {
      toast.error("All fields are required.");
      setIsSubmitting(false);
      return;
    }

    const emailParams = {
      name: formData.name,
      email: formData.email,
      message: formData.message,
    };

    try {
      const response = await send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID as string,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID as string,
        emailParams,
        process.env.NEXT_PUBLIC_EMAILJS_USER_ID as string
      );
      console.log("Email sent successfully:", response);
      toast.success("Your message has been sent!");
      setFormData({
        name: "",
        email: "",
        message: "",
      });
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error("Sorry, there was an error sending your message.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      id="contact"
      className={`relative min-h-screen py-20 px-4 sm:px-6 lg:px-8 ${isDarkMode ? "bg-black" : "bg-gray-50"
        }`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold mb-4 bg-linear-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Let's Connect
          </h2>
          <p
            className={`text-xl md:text-2xl ${isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
          >
            Have a project in mind? Let's make it happen together
          </p>
        </div>


        {/* Contact Info */}
        <div className="space-y-8">
          <div>
            <h3
              className={`text-3xl font-bold mb-6 ${isDarkMode ? "text-white" : "text-gray-900"
                }`}
            >
              Get in Touch
            </h3>
            <p
              className={`text-lg mb-8 ${isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
            >
              I'm always open to discussing new projects, creative ideas, or
              opportunities to be part of your vision.
            </p>
          </div>

          {/* Contact Form */}
          <div>
            <BackgroundGradient className="rounded-[22px] p-1">
              <div
                className={`p-8 rounded-[20px] ${isDarkMode ? "bg-black" : "bg-white"
                  }`}
              >
                <h3
                  className={`text-2xl font-bold mb-6 ${isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                >
                  Send a Message
                </h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label
                      htmlFor="name"
                      className={`block text-sm font-medium mb-2 flex items-center gap-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                    >
                      <User className="w-4 h-4" />
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      required
                      className={`w-full px-4 py-3 rounded-lg border transition-all ${isDarkMode
                        ? "bg-gray-900 border-gray-700 text-white focus:border-blue-500"
                        : "bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500"
                        } focus:ring-2 focus:ring-blue-500/20 focus:outline-none`}
                      placeholder="Your name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className={`block text-sm font-medium mb-2 flex items-center gap-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                    >
                      <Mail className="w-4 h-4" />
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      className={`w-full px-4 py-3 rounded-lg border transition-all ${isDarkMode
                        ? "bg-gray-900 border-gray-700 text-white focus:border-purple-500"
                        : "bg-gray-50 border-gray-300 text-gray-900 focus:border-purple-500"
                        } focus:ring-2 focus:ring-purple-500/20 focus:outline-none`}
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className={`block text-sm font-medium mb-2 flex items-center gap-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                    >
                      <MessageSquare className="w-4 h-4" />
                      Message
                    </label>
                    <textarea
                      id="message"
                      rows={5}
                      required
                      className={`w-full px-4 py-3 rounded-lg border transition-all resize-none ${isDarkMode
                        ? "bg-gray-900 border-gray-700 text-white focus:border-pink-500"
                        : "bg-gray-50 border-gray-300 text-gray-900 focus:border-pink-500"
                        } focus:ring-2 focus:ring-pink-500/20 focus:outline-none`}
                      placeholder="Tell me about your project..."
                      value={formData.message}
                      onChange={handleChange}
                    ></textarea>
                  </div>

                  <MovingBorder
                    as="button"
                    type="submit"
                    disabled={isSubmitting}
                    duration={3000}
                    className="w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </MovingBorder>
                </form>
              </div>
            </BackgroundGradient>
          </div>

          {/* Social Links */}
          <div>
            <h4
              className={`text-xl font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-900"
                }`}
            >
              Connect on Social
            </h4>
            <div className="flex gap-4">
              <a
                href={process.env.NEXT_PUBLIC_LINKEDIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={`p-3 rounded-lg transition-all duration-300 ${isDarkMode
                  ? "bg-gray-800 hover:bg-blue-600"
                  : "bg-gray-200 hover:bg-blue-500"
                  } hover:scale-110`}
              >
                <Linkedin className="w-6 h-6" />
              </a>
              <a
                href={process.env.NEXT_PUBLIC_MY_EMAIL}
                target="_blank"
                rel="noopener noreferrer"
                className={`p-3 rounded-lg transition-all duration-300 ${isDarkMode
                  ? "bg-gray-800 hover:bg-purple-600"
                  : "bg-gray-200 hover:bg-purple-500"
                  } hover:scale-110`}
              >
                <Github className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>


      </div>
    </div>
  );
};

export default Contact;
