"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Play, X, ChevronLeft, ChevronRight, ChevronDown, ArrowRight, RotateCcw, Home } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

// Quiz questions for each illness
const quizQuestions = {
  Diabetes: [
    {
      question: "How long have you been managing blood sugar concerns?",
      options: ["Less than 1 year", "1-3 years", "3-5 years", "More than 5 years"]
    },
    {
      question: "Do you experience energy crashes after meals?",
      options: ["Never", "Rarely", "Sometimes", "Often"]
    },
    {
      question: "Are you currently taking medication for blood sugar?",
      options: ["No medication", "Metformin only", "Multiple medications", "Insulin"]
    },
    {
      question: "How would you rate your current gut health?",
      options: ["Excellent", "Good", "Fair", "Poor"]
    }
  ],
  IBS: [
    {
      question: "How often do you experience digestive discomfort?",
      options: ["Rarely", "Weekly", "Several times a week", "Daily"]
    },
    {
      question: "Which symptoms affect you most?",
      options: ["Bloating", "Cramping", "Irregular bowel movements", "All of the above"]
    },
    {
      question: "Have you tried probiotics before?",
      options: ["Never", "Yes, with no results", "Yes, with some improvement", "Yes, with great results"]
    },
    {
      question: "How does stress affect your symptoms?",
      options: ["No effect", "Slight increase", "Moderate increase", "Severe worsening"]
    }
  ],
  Anxiety: [
    {
      question: "How often do you experience anxiety symptoms?",
      options: ["Rarely", "Weekly", "Several times a week", "Daily"]
    },
    {
      question: "Do you notice a connection between your gut and mood?",
      options: ["Never noticed", "Rarely", "Sometimes", "Very often"]
    },
    {
      question: "Have you tried natural anxiety remedies?",
      options: ["Never", "A few things", "Many options", "Everything I can find"]
    },
    {
      question: "How would you describe your digestive health?",
      options: ["Excellent", "Good", "Fair", "Poor"]
    }
  ],
  Depression: [
    {
      question: "How long have you been dealing with mood concerns?",
      options: ["Less than 6 months", "6 months - 1 year", "1-3 years", "More than 3 years"]
    },
    {
      question: "Do you experience digestive issues alongside mood changes?",
      options: ["Never", "Rarely", "Sometimes", "Often"]
    },
    {
      question: "Have you explored the gut-brain connection?",
      options: ["Never heard of it", "Heard about it", "Researched it", "Actively working on it"]
    },
    {
      question: "How is your energy level throughout the day?",
      options: ["Consistently high", "Good most days", "Up and down", "Consistently low"]
    }
  ],
  Autoimmune: [
    {
      question: "Which autoimmune condition are you managing?",
      options: ["Rheumatoid Arthritis", "Hashimoto's", "Crohn's/Colitis", "Multiple/Other"]
    },
    {
      question: "How often do you experience flare-ups?",
      options: ["Rarely", "Monthly", "Weekly", "Constantly"]
    },
    {
      question: "Have you focused on gut health for immune support?",
      options: ["Never considered it", "Heard about it", "Tried some things", "It's my main focus"]
    },
    {
      question: "How would you rate your current inflammation levels?",
      options: ["Very low", "Manageable", "Moderate", "High"]
    }
  ],
  "Digestive Issues": [
    {
      question: "What digestive issues do you experience most?",
      options: ["Bloating/Gas", "Irregular bowel movements", "Stomach pain", "All of the above"]
    },
    {
      question: "How long have you had these symptoms?",
      options: ["Less than 3 months", "3-6 months", "6 months - 1 year", "More than 1 year"]
    },
    {
      question: "Have you tried probiotics or digestive supplements?",
      options: ["Never", "Yes, no improvement", "Yes, some improvement", "Yes, significant improvement"]
    },
    {
      question: "How do your symptoms affect your daily life?",
      options: ["Minimal impact", "Some disruption", "Moderate impact", "Significant impact"]
    }
  ],
  "Skin Conditions": [
    {
      question: "What skin concerns are you dealing with?",
      options: ["Acne", "Eczema/Dermatitis", "Rosacea", "Multiple conditions"]
    },
    {
      question: "Have you noticed a connection between your diet and skin?",
      options: ["Never noticed", "Slight connection", "Clear connection", "Very strong connection"]
    },
    {
      question: "How long have you had these skin issues?",
      options: ["Less than 6 months", "6 months - 1 year", "1-3 years", "More than 3 years"]
    },
    {
      question: "Have you explored gut health for skin improvement?",
      options: ["Never considered it", "Heard about it", "Tried some things", "It's my main approach"]
    }
  ]
};

interface FeaturesProps {
  features: {
    id: number;
    icon: React.ElementType | string;
    title: string;
    description: string;
    image: string;
  }[];
  primaryColor?: string;
  progressGradientLight?: string;
  progressGradientDark?: string;
}

// Dynamic content for each illness
const illnessContent = {
  Diabetes: {
    tagline: "Blood Sugar Balance. Natural Support.",
    heading: "How Eubiosis Helps with Diabetes",
    description: "Discover how our probiotic formula supports healthy blood sugar levels and metabolic function",
    features: [
      {
        id: 1,
        icon: "/images/Gut_Harmony_Restored.png?v=2",
        title: "Metabolic Harmony",
        description: "Eubiosis supports healthy insulin sensitivity and glucose metabolism through optimized gut bacteria balance.",
        image: "/images/hands.png",
      },
      {
        id: 2,
        icon: "/images/42_Beneficial_Strains.png?v=2",
        title: "Blood Sugar Support Strains",
        description: "Our targeted strains help maintain healthy blood glucose levels and support pancreatic function.",
        image: "/images/bottles/bottle.png",
      },
      {
        id: 3,
        icon: "/images/Natural_Delivery_System.png?v=2",
        title: "Gentle Metabolic Support",
        description: "Organic honey delivery ensures our beneficial strains reach your gut intact for maximum metabolic benefits.",
        image: "/images/bottles/bottle-combo.png",
      },
    ]
  },
  IBS: {
    tagline: "Digestive Relief. Lasting Comfort.",
    heading: "IBS Relief with Eubiosis",
    description: "Find natural relief from IBS symptoms with our comprehensive gut-healing probiotic formula",
    features: [
      {
        id: 1,
        icon: "/images/Gut_Harmony_Restored.png?v=2",
        title: "IBS Symptom Relief",
        description: "Our probiotic strains help reduce bloating, cramping, and irregular bowel movements associated with IBS.",
        image: "/images/hands.png",
      },
      {
        id: 2,
        icon: "/images/42_Beneficial_Strains.png?v=2",
        title: "Gut Motility Strains",
        description: "Specially selected strains support healthy gut motility and reduce digestive discomfort.",
        image: "/images/bottles/bottle.png",
      },
      {
        id: 3,
        icon: "/images/Natural_Delivery_System.png?v=2",
        title: "Soothing Delivery",
        description: "Gentle honey-based delivery system calms irritated gut lining while delivering healing bacteria.",
        image: "/images/bottles/bottle-combo.png",
      },
    ]
  },
  Anxiety: {
    tagline: "Mental Clarity. Gut-Brain Balance.",
    heading: "Anxiety Support Through Gut Health",
    description: "Discover the connection between gut health and mental well-being with our anxiety-supporting formula",
    features: [
      {
        id: 1,
        icon: "/images/Gut_Harmony_Restored.png?v=2",
        title: "Gut-Brain Axis Support",
        description: "Eubiosis supports the gut-brain connection, helping reduce anxiety through optimized microbiome balance.",
        image: "/images/hands.png",
      },
      {
        id: 2,
        icon: "/images/42_Beneficial_Strains.png?v=2",
        title: "Mood-Stabilizing Strains",
        description: "Our strains produce calming neurotransmitters and support healthy serotonin production.",
        image: "/images/bottles/bottle.png",
      },
      {
        id: 3,
        icon: "/images/Natural_Delivery_System.png?v=2",
        title: "Stress-Resistant Delivery",
        description: "Honey-based formula survives stomach acid to deliver calming bacteria directly to your gut.",
        image: "/images/bottles/bottle-combo.png",
      },
    ]
  },
  Depression: {
    tagline: "Mood Enhancement. Natural Balance.",
    heading: "Depression Support with Probiotics",
    description: "Support mental health naturally with our depression-fighting probiotic strains",
    features: [
      {
        id: 1,
        icon: "/images/Gut_Harmony_Restored.png?v=2",
        title: "Mood Enhancement",
        description: "Our probiotic formula supports healthy neurotransmitter production and mood regulation.",
        image: "/images/hands.png",
      },
      {
        id: 2,
        icon: "/images/42_Beneficial_Strains.png?v=2",
        title: "Neurotransmitter Strains",
        description: "Strains that support serotonin and dopamine production for improved mental well-being.",
        image: "/images/bottles/bottle.png",
      },
      {
        id: 3,
        icon: "/images/Natural_Delivery_System.png?v=2",
        title: "Brain-Gut Connection",
        description: "Honey delivery ensures maximum absorption for optimal brain-gut axis support.",
        image: "/images/bottles/bottle-combo.png",
      },
    ]
  },
  Autoimmune: {
    tagline: "Immune Balance. Natural Regulation.",
    heading: "Autoimmune Support with Eubiosis",
    description: "Help regulate your immune system naturally with our autoimmune-supporting probiotic formula",
    features: [
      {
        id: 1,
        icon: "/images/Gut_Harmony_Restored.png?v=2",
        title: "Immune System Balance",
        description: "Eubiosis supports healthy immune regulation and reduces autoimmune flare-ups through gut health.",
        image: "/images/hands.png",
      },
      {
        id: 2,
        icon: "/images/42_Beneficial_Strains.png?v=2",
        title: "Anti-Inflammatory Strains",
        description: "Our strains help reduce systemic inflammation and support immune system homeostasis.",
        image: "/images/bottles/bottle.png",
      },
      {
        id: 3,
        icon: "/images/Natural_Delivery_System.png?v=2",
        title: "Gentle Immune Support",
        description: "Organic honey delivery provides soothing anti-inflammatory benefits alongside immune support.",
        image: "/images/bottles/bottle-combo.png",
      },
    ]
  },
  "Digestive Issues": {
    tagline: "Complete Digestive Health. Natural Relief.",
    heading: "Comprehensive Digestive Support",
    description: "Resolve all types of digestive issues with our complete gut-healing probiotic solution",
    features: [
      {
        id: 1,
        icon: "/images/Gut_Harmony_Restored.png?v=2",
        title: "Complete Digestive Relief",
        description: "Eubiosis addresses bloating, gas, indigestion, and other digestive discomforts comprehensively.",
        image: "/images/hands.png",
      },
      {
        id: 2,
        icon: "/images/42_Beneficial_Strains.png?v=2",
        title: "Full-Spectrum Strains",
        description: "Complete coverage of beneficial bacteria for all aspects of digestive health and function.",
        image: "/images/bottles/bottle.png",
      },
      {
        id: 3,
        icon: "/images/Natural_Delivery_System.png?v=2",
        title: "Maximum Absorption",
        description: "Honey-based delivery ensures all 42 strains reach your gut intact for complete digestive support.",
        image: "/images/bottles/bottle-combo.png",
      },
    ]
  },
  "Skin Conditions": {
    tagline: "Clear Skin. Gut-Based Beauty.",
    heading: "Skin Health Through Gut Balance",
    description: "Achieve clearer, healthier skin by addressing the root cause - your gut microbiome",
    features: [
      {
        id: 1,
        icon: "/images/Gut_Harmony_Restored.png?v=2",
        title: "Skin-Gut Connection",
        description: "Eubiosis supports the gut-skin axis, helping clear skin conditions from the inside out.",
        image: "/images/hands.png",
      },
      {
        id: 2,
        icon: "/images/42_Beneficial_Strains.png?v=2",
        title: "Skin-Clearing Strains",
        description: "Our strains reduce inflammation and support healthy skin barrier function.",
        image: "/images/bottles/bottle.png",
      },
      {
        id: 3,
        icon: "/images/Natural_Delivery_System.png?v=2",
        title: "Beauty from Within",
        description: "Honey delivery provides natural anti-inflammatory benefits for comprehensive skin health.",
        image: "/images/bottles/bottle-combo.png",
      },
    ]
  }
};

export function EubiosisFeatures({ illness, onBrowsingClick, onResetToHero, onPrevIllness, onNextIllness, onLearnMoreClick, cycling }: { illness?: string | null; onBrowsingClick?: () => void; onResetToHero?: () => void; onPrevIllness?: () => void; onNextIllness?: () => void; onLearnMoreClick?: () => void; cycling?: boolean }) {
  const [currentFeature, setCurrentFeature] = useState(0);
  const [progress, setProgress] = useState(0);
  const [selectedVideoIndex, setSelectedVideoIndex] = useState<number | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<string[]>([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const containerRef = useRef<HTMLDivElement>(null);
  const featureRefs = useRef<(HTMLDivElement | null)[]>([]);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });

  const illnesses = ['IBS', 'Diabetes', 'Anxiety', 'Depression', 'Autoimmune', 'Digestive Issues'];

  // Get content based on selected illness, fallback to default if no illness selected
  const currentContent = illness ? illnessContent[illness as keyof typeof illnessContent] : {
    tagline: "Natural Gut Health. Real Results.",
    heading: "What is Eubiosis?",
    description: "Discover what makes our formula exceptional with these certified benefits",
    features: [
      {
        id: 1,
        icon: "/images/Gut_Harmony_Restored.png?v=2",
        title: "Gut Harmony Restored",
        description:
          "Eubiosis represents the perfect balance of your body's microbial ecosystem. When beneficial bacteria thrive, you experience optimal health and vitality.",
        image: "/images/hands.png",
      },
      {
        id: 2,
        icon: "/images/42_Beneficial_Strains.png?v=2",
        title: "42 Beneficial Strains",
        description:
          "Our advanced formula contains 42 carefully selected beneficial bacterial strains, suspended in pure organic honey for maximum effectiveness.",
        image: "/images/bottles/bottle.png",
      },
      {
        id: 3,
        icon: "/images/Natural_Delivery_System.png?v=2",
        title: "Natural Delivery System",
        description:
          "Organic honey serves as nature's perfect delivery system, ensuring optimal absorption and colonization of beneficial bacteria in your gut.",
        image: "/images/bottles/bottle-combo.png",
      },
    ]
  };

  const features = currentContent.features;

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 100 : prev + 0.1));
    }, 10);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      setTimeout(() => {
        setCurrentFeature((prev) => (prev + 1) % features.length);
        setProgress(0);
      }, 200);
    }
  }, [progress]);

  useEffect(() => {
    const activeFeatureElement = featureRefs.current[currentFeature];
    const container = containerRef.current;

    if (activeFeatureElement && container) {
      const containerRect = container.getBoundingClientRect();
      const elementRect = activeFeatureElement.getBoundingClientRect();

      container.scrollTo({
        left:
          activeFeatureElement.offsetLeft -
          (containerRect.width - elementRect.width) / 2,
        behavior: "smooth",
      });
    }
  }, [currentFeature]);

  const handleFeatureClick = (index: number) => {
    setCurrentFeature(index);
    setProgress(0);
  };

  const handleQuizStart = () => {
    setShowQuiz(true);
    setCurrentQuestion(0);
    setQuizAnswers([]);
    setQuizCompleted(false);
    setSelectedAnswer("");
    setDropdownOpen(false);
  };

  const handleQuizAnswer = (answer: string) => {
    const newAnswers = [...quizAnswers, answer];
    setQuizAnswers(newAnswers);
    setSelectedAnswer("");
    setDropdownOpen(false);
    
    if (currentQuestion < 3) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  const handleQuizReset = () => {
    setShowQuiz(false);
    setCurrentQuestion(0);
    setQuizAnswers([]);
    setQuizCompleted(false);
    setSelectedAnswer("");
    setDropdownOpen(false);
  };

  const handleDropdownSelect = (option: string) => {
    setSelectedAnswer(option);
    setDropdownOpen(false);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer) {
      handleQuizAnswer(selectedAnswer);
    }
  };

  const getQuizResult = () => {
    // Simple scoring based on answers
    const score = quizAnswers.reduce((total, answer, index) => {
      // Higher scores for answers that suggest Eubiosis would be more beneficial
      if (index === 0) return total + (quizAnswers[0] === "More than 5 years" ? 3 : quizAnswers[0] === "3-5 years" ? 2 : 1);
      if (index === 1) return total + (answer === "Often" ? 3 : answer === "Sometimes" ? 2 : 1);
      if (index === 2) return total + (answer === "Never" || answer === "Yes, with no results" ? 3 : 2);
      if (index === 3) return total + (answer === "Poor" ? 3 : answer === "Fair" ? 2 : 1);
      return total;
    }, 0);

    if (score >= 10) return { match: "Excellent", message: "Eubiosis appears to be an excellent fit for your needs!" };
    if (score >= 7) return { match: "Good", message: "Eubiosis could be very beneficial for your situation." };
    if (score >= 5) return { match: "Moderate", message: "Eubiosis may help, though results may vary." };
    return { match: "Limited", message: "Eubiosis might provide some benefits, but consider consulting with a healthcare provider." };
  };

  return (
    <div ref={sectionRef} className="min-h-screen py-8 px-4" style={{ backgroundColor: '#fefefc' }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          className={`${illness ? 'flex flex-col items-center text-center space-y-2' : 'grid lg:grid-cols-3 grid-cols-1 gap-8 items-center'} mb-16`}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {illness ? (
            <>
              {/* Stacked Layout for Illness Selection */}
              <motion.span 
                className="text-[#8bccc2] font-semibold text-sm uppercase tracking-wider"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              >
                {currentContent.tagline}
              </motion.span>
              
              <motion.h2 
                className="text-3xl md:text-4xl lg:text-5xl font-bold text-text max-w-4xl"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              >
                {currentContent.heading}
              </motion.h2>
              
              <motion.div 
                className="w-40 h-px relative"
                initial={{ opacity: 0, scaleX: 0 }}
                animate={isInView ? { opacity: 1, scaleX: 1 } : { opacity: 0, scaleX: 0 }}
                transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#8bccc2] to-transparent rounded-full"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#78b4aa] to-transparent rounded-full opacity-80"></div>
              </motion.div>
              
              <motion.p 
                className="text-sm lg:text-base text-text/70 leading-relaxed max-w-3xl"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
              >
                {currentContent.description}
              </motion.p>
            </>
          ) : (
            <>
              {/* Original 3-Column Layout for Default */}
              {/* Left Side - Heading */}
              <motion.div 
                className="text-left"
                initial={{ opacity: 0, x: -50 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              >
                <span className={`text-[#8bccc2] font-semibold text-sm uppercase tracking-wider block mb-4`}>
                  {currentContent.tagline}
                </span>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-text">
                  {currentContent.heading}
                </h2>
              </motion.div>

              {/* Middle - Separator Line */}
              <motion.div 
                className="hidden lg:flex justify-center"
                initial={{ opacity: 0, scaleX: 0 }}
                animate={isInView ? { opacity: 1, scaleX: 1 } : { opacity: 0, scaleX: 0 }}
                transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
              >
                <div className="relative w-40 h-px">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#8bccc2] to-transparent rounded-full"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#78b4aa] to-transparent rounded-full opacity-80"></div>
                </div>
              </motion.div>

              {/* Right Side - Description */}
              <motion.div 
                className="text-left lg:text-right"
                initial={{ opacity: 0, x: 50 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
                transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
              >
                <p className="text-base lg:text-lg text-text/70 leading-relaxed">
                  {currentContent.description}
                </p>
              </motion.div>
            </>
          )}
        </motion.div>

        <div className="grid lg:grid-cols-2 lg:gap-16 gap-8 items-start">
          {/* Left Side - Scrollable Content */}
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          >
            {/* Scrollable Content Container */}
            <div className="h-[390px] overflow-y-auto pr-4 space-y-6 scrollbar-thin scrollbar-thumb-[#8bccc2] scrollbar-track-gray-100 scrollbar-w-2">
              
              {/* Feature Text List */}
              {features.map((feature, index) => {
                const isActive = currentFeature === index;

                return (
                  <motion.div
                    key={feature.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                    transition={{ duration: 0.6, delay: 0.6 + (index * 0.1), ease: "easeOut" }}
                  >
                    <div
                      className="cursor-pointer py-4"
                      onClick={() => handleFeatureClick(index)}
                    >
                      <h3 className={`text-lg font-semibold mb-2 ${isActive ? 'text-[#8bccc2]' : 'text-gray-900'}`}>
                        {feature.title}
                      </h3>
                      <p className={`text-sm leading-relaxed ${isActive ? 'text-gray-700' : 'text-gray-600'}`}>
                        {feature.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}

              {/* Additional Content - Plain Text */}
              <motion.div 
                className="pt-6 mt-6"
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
              >
                <h4 className="text-base font-semibold text-gray-900 mb-3">Why Choose Eubiosis?</h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Clinically proven bacterial strains. Natural honey delivery system. No artificial preservatives. Third-party tested for purity.
                </p>
              </motion.div>

              {/* Scientific Research - Plain Text */}
              <motion.div 
                className="pt-6 mt-6"
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.6, delay: 1.0, ease: "easeOut" }}
              >
                <h4 className="text-base font-semibold text-gray-900 mb-3">Scientific Research</h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Our formula is backed by extensive research on the gut microbiome and its impact on overall health. 
                  Studies show that diverse probiotic strains can significantly improve digestive health and immune function.
                  Based on 50+ peer-reviewed studies.
                </p>
              </motion.div>

              {/* Customer Success - Plain Text */}
              <motion.div 
                className="pt-6 mt-6"
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.6, delay: 1.2, ease: "easeOut" }}
              >
                <h4 className="text-base font-semibold text-gray-900 mb-3">Customer Success</h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  94% report improvement. 2 weeks average results.
                </p>
              </motion.div>

            </div>
          </motion.div>

          {/* Right Side - Quiz + Video Side by Side */}
          {illness ? (
            <div className="relative order-1 w-full max-w-full mx-auto lg:order-2">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Quiz Section - Left Side */}
                <div className="flex-1 bg-gradient-to-br from-[#8bccc2] to-[#78b4aa] rounded-2xl border border-gray-200 dark:border-gray-700 p-6 text-center h-[280px] relative">
                  {!showQuiz ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
                    >
                      <motion.h3 
                        className="text-white text-xl font-semibold mb-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        transition={{ duration: 0.6, delay: 1.0, ease: "easeOut" }}
                      >
                        Quick Quiz: {illness}
                      </motion.h3>
                      <motion.p 
                        className="text-white/80 text-sm mb-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        transition={{ duration: 0.6, delay: 1.1, ease: "easeOut" }}
                      >
                        Take our quick assessment to understand how Eubiosis can help with {illness.toLowerCase()}.
                      </motion.p>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        transition={{ duration: 0.6, delay: 1.2, ease: "easeOut" }}
                      >
                        <button 
                          onClick={handleQuizStart}
                          className="btn-secondary"
                        >
                          Start Quiz
                        </button>
                      </motion.div>
                    </motion.div>
                  ) : (
                    <div className="text-left h-full flex flex-col">
                      {!quizCompleted ? (
                        <>
                          {/* Progress Bar */}
                          <div className="mb-4 flex-shrink-0">
                            <div className="flex justify-between text-white/80 text-sm mb-2">
                              <span>Question {currentQuestion + 1} of 4</span>
                              <span>{Math.round(((currentQuestion + 1) / 4) * 100)}%</span>
                            </div>
                            <div className="w-full bg-white/20 rounded-full h-2">
                              <div 
                                className="bg-white rounded-full h-2 transition-all duration-300"
                                style={{ width: `${((currentQuestion + 1) / 4) * 100}%` }}
                              ></div>
                            </div>
                          </div>

                          {/* Question */}
                          <h4 className="text-white text-base font-semibold mb-3 flex-shrink-0">
                            {illness && quizQuestions[illness as keyof typeof quizQuestions]?.[currentQuestion]?.question}
                          </h4>

                          {/* Answer Options - Morphing Bubble Dropdown */}
                          <div className="mb-4 flex-shrink-0 relative">
                            <div className="relative">
                              {/* Main Bubble Button */}
                              <div 
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className={`
                                  w-full p-4 cursor-pointer transition-all duration-500 ease-out transform
                                  ${dropdownOpen 
                                    ? 'bg-[#8bccc2] scale-105 shadow-lg' 
                                    : 'bg-white/10 hover:bg-[#8bccc2]/20 hover:scale-102'
                                  }
                                  border-2 border-[#8bccc2]/30 hover:border-[#8bccc2]/50
                                `}
                                style={{
                                  borderRadius: '9px',
                                  background: dropdownOpen 
                                    ? '#8bccc2'
                                    : 'rgba(255,255,255,0.1)'
                                }}
                              >
                                <div className="flex items-center justify-between">
                                  <span className={`text-sm transition-all duration-300 ${selectedAnswer ? (dropdownOpen ? 'text-white font-medium' : 'text-white font-medium') : (dropdownOpen ? 'text-white/90' : 'text-white/70')}`}>
                                    {selectedAnswer || "✨ Choose your answer..."}
                                  </span>
                                  <div className={`transition-all duration-500 ${dropdownOpen ? 'rotate-180 scale-110' : 'rotate-0'}`}>
                                    <div className="w-6 h-6 bg-white/20 flex items-center justify-center" style={{ borderRadius: '9px' }}>
                                      <ChevronDown size={14} className="text-white" />
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Morphing Options Container */}
                              <div className={`
                                absolute bottom-full left-0 right-0 mb-2 transition-all duration-700 ease-out origin-bottom z-50
                                ${dropdownOpen 
                                  ? 'opacity-100 scale-100 translate-y-0' 
                                  : 'opacity-0 scale-95 translate-y-4 pointer-events-none'
                                }
                              `}>
                                <div className="bg-white shadow-2xl border border-[#8bccc2]/20 overflow-hidden" style={{ borderRadius: '9px' }}>
                                  {/* Floating Header */}
                                  <div className="p-3 bg-[#8bccc2]/10 border-b border-[#8bccc2]/20">
                                    <div className="flex items-center space-x-2">
                                      <div className="w-2 h-2 bg-[#8bccc2] animate-pulse" style={{ borderRadius: '9px' }}></div>
                                      <span className="text-xs font-medium text-[#8bccc2]">Select your answer</span>
                                    </div>
                                  </div>
                                  
                                  {/* Animated Options */}
                                  <div className="max-h-32 overflow-y-auto">
                                    {illness && quizQuestions[illness as keyof typeof quizQuestions]?.[currentQuestion]?.options.map((option, index) => (
                                      <button
                                        key={index}
                                        type="button"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          e.stopPropagation();
                                          handleDropdownSelect(option);
                                        }}
                                        className={`
                                          relative p-3 cursor-pointer transition-all duration-300 group w-full text-left
                                          hover:bg-[#8bccc2]/10
                                          ${selectedAnswer === option ? 'bg-[#8bccc2]/20' : ''}
                                        `}
                                        style={{
                                          animationDelay: `${index * 0.05}s`
                                        }}
                                      >
                                        {/* Morphing Background */}
                                        <div className={`
                                          absolute inset-0 transition-all duration-300
                                          ${selectedAnswer === option 
                                            ? 'bg-[#8bccc2]/20 scale-100' 
                                            : 'bg-transparent scale-95 group-hover:scale-100 group-hover:bg-[#8bccc2]/5'
                                          }
                                        `} style={{ borderRadius: '9px' }} />
                                        
                                        {/* Option Content */}
                                        <div className="relative flex items-center space-x-3">
                                          {/* Animated Indicator */}
                                          <div className={`
                                            w-3 h-3 transition-all duration-300 flex-shrink-0
                                            ${selectedAnswer === option 
                                              ? 'bg-[#8bccc2] scale-100 shadow-lg' 
                                              : 'bg-gray-300 scale-75 group-hover:bg-[#8bccc2]/50 group-hover:scale-90'
                                            }
                                          `} style={{ borderRadius: '9px' }}>
                                            {selectedAnswer === option && (
                                              <div className="w-full h-full bg-white/30 animate-ping" style={{ borderRadius: '9px' }} />
                                            )}
                                          </div>
                                          
                                          {/* Option Text */}
                                          <span className={`
                                            text-sm transition-all duration-300
                                            ${selectedAnswer === option 
                                              ? 'text-[#8bccc2] font-medium' 
                                              : 'text-gray-600 group-hover:text-[#8bccc2]'
                                            }
                                          `}>
                                            {option}
                                          </span>
                                          
                                          {/* Hover Effect */}
                                          <div className={`
                                            ml-auto opacity-0 group-hover:opacity-100 transition-all duration-300
                                            ${selectedAnswer === option ? 'opacity-100' : ''}
                                          `}>
                                            <div className="w-1 h-1 bg-[#8bccc2]" style={{ borderRadius: '9px' }} />
                                          </div>
                                        </div>
                                        
                                        {/* Ripple Effect */}
                                        <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ borderRadius: '9px' }}>
                                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#8bccc2]/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                                        </div>
                                      </button>
                                    ))}
                                  </div>
                                  
                                  {/* Floating Footer */}
                                  <div className="p-2 bg-[#8bccc2]/5 border-t border-[#8bccc2]/20">
                                    <div className="flex justify-center">
                                      <div className="w-8 h-1 bg-[#8bccc2]/30" style={{ borderRadius: '9px' }} />
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Click Outside to Close */}
                              {dropdownOpen && (
                                <div 
                                  className="fixed inset-0 z-40" 
                                  onClick={() => setDropdownOpen(false)}
                                />
                              )}
                            </div>
                          </div>

                          {/* Next Button */}
                          <div className="mb-3 flex-shrink-0">
                            <button
                              onClick={handleNextQuestion}
                              disabled={!selectedAnswer}
                              className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed text-sm w-full"
                            >
                              {currentQuestion === 3 ? 'Complete Quiz' : 'Next Question'}
                            </button>
                          </div>

                          {/* Navigation */}
                          <div className="flex justify-start flex-shrink-0">
                            <button
                              onClick={() => {
                                setCurrentQuestion(Math.max(0, currentQuestion - 1));
                                setSelectedAnswer("");
                              }}
                              disabled={currentQuestion === 0}
                              className="flex items-center space-x-1 text-white/60 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed text-sm"
                            >
                              <ChevronLeft size={14} />
                              <span>Previous</span>
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          {/* Quiz Results */}
                          <div className="text-center h-full flex flex-col justify-center">
                            <h4 className="text-white text-lg font-semibold mb-3">Quiz Complete!</h4>
                            <div className="bg-white/10 rounded-lg p-3 mb-3">
                              <div className="text-xl font-bold text-white mb-2">
                                {getQuizResult().match} Match
                              </div>
                              <p className="text-white/80 text-sm">
                                {getQuizResult().message}
                              </p>
                            </div>
                            <div className="flex gap-2 justify-center">
                              <button 
                                onClick={() => window.location.href = '/eubiosis-bottle/size-s/quantity-1'}
                                className="btn flex items-center gap-2 text-xs"
                              >
                                Buy Now
                              </button>
                              <button
                                onClick={handleQuizReset}
                                className="btn-secondary flex items-center gap-2"
                              >
                                <RotateCcw size={16} />
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  {/* Dropdown Overlay Prevention */}
                  {dropdownOpen && (
                    <div 
                      className="fixed inset-0 z-0" 
                      onClick={() => setDropdownOpen(false)}
                    />
                  )}
                </div>

                {/* Video Section - Right Side */}
                <div className="flex-1 min-w-0 max-w-xl">
                  <motion.div
                    key={currentFeature}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="relative w-full"
                  >
                    {/* Video Placeholder Container */}
                    <div className="w-full h-[280px] bg-gradient-to-br from-[#8bccc2] to-[#78b4aa] rounded-2xl border border-gray-200 dark:border-gray-700 flex items-center justify-center relative overflow-hidden cursor-pointer group"
                         onClick={() => setSelectedVideoIndex(currentFeature)}>
                      
                      {/* Video placeholder background pattern */}
                      <div className="absolute inset-0 bg-black/20">
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="w-32 h-20 bg-white/20 rounded-lg relative">
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-4 h-4 bg-white rounded-full"></div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Play Button Overlay */}
                      <div className="relative z-10 flex flex-col items-center space-y-2 group-hover:scale-110 transition-transform duration-300">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
                          <Play className="w-8 h-8 text-white ml-1" fill="white" />
                        </div>
                        <div className="text-center">
                          <h3 className="text-white text-lg font-semibold mb-1">{features[currentFeature].title}</h3>
                          <p className="text-white/80 text-xs">Click to watch video</p>
                        </div>
                      </div>

                      {/* Gradient Overlay for better text readability */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Action Buttons */}
              <motion.div 
                className="text-center mt-6 space-y-4"
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.8, delay: 1.0, ease: "easeOut" }}
              >
                <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                  {/* Show carousel only when cycling */}
                  {cycling && (
                    <>
                      {/* Carousel Navigation */}
                      <div className="relative">
                        {/* Enhanced Navigation Display with integrated arrows */}
                        <div className="flex items-center justify-between bg-white/80 backdrop-blur-sm rounded-lg px-4 py-3 shadow-lg border border-[#8bccc2]/20 min-w-[280px]">
                          <motion.button 
                            className="p-2 rounded-full hover:bg-[#8bccc2]/20 transition-colors"
                            onClick={onPrevIllness}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.6, delay: 1.2, ease: "easeOut" }}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <ChevronLeft className="w-5 h-5 text-[#8bccc2]" />
                          </motion.button>
                          
                          <div className="flex flex-col items-center gap-2">
                            <div className="text-[#8bccc2] font-bold text-base">
                              {illness}
                            </div>
                            <div className="text-gray-700 font-medium text-sm">
                              Symptoms {illnesses.indexOf(illness || illnesses[0]) + 1} to {illnesses.length}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              {illnesses.map((_, index) => (
                                <div
                                  key={index}
                                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                                    index === illnesses.indexOf(illness || illnesses[0])
                                      ? 'bg-[#8bccc2] scale-125 shadow-md'
                                      : 'bg-gray-300 hover:bg-[#8bccc2]/50'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          
                          <motion.button 
                            className="p-2 rounded-full hover:bg-[#8bccc2]/20 transition-colors"
                            onClick={onNextIllness}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.6, delay: 1.4, ease: "easeOut" }}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <ChevronRight className="w-5 h-5 text-[#8bccc2]" />
                          </motion.button>
                        </div>
                      </div>
                      
                      {/* Read More Button for Cycling Mode */}
                      <motion.button 
                        className="btn-secondary"
                        onClick={onLearnMoreClick}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.6, delay: 1.6, ease: "easeOut" }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        READ MORE
                      </motion.button>
                    </>
                  )}
                  
                  {/* Show Learn More button only when NOT cycling (single illness selected) */}
                  {!cycling && (
                    <motion.button 
                      className="btn-secondary"
                      onClick={onLearnMoreClick}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.6, delay: 1.8, ease: "easeOut" }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      LEARN MORE
                    </motion.button>
                  )}
                  
                  {/* Back Home Button */}
                  <motion.button 
                    className="btn-secondary p-3"
                    onClick={onResetToHero}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.6, delay: cycling ? 1.6 : 1.8, ease: "easeOut" }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Home className="w-5 h-5" />
                  </motion.button>
                </div>
              </motion.div>
            </div>
          ) : (
            <div className="relative order-1 w-full max-w-full mx-auto lg:order-2">
              <motion.div
                key={currentFeature}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="relative w-full"
              >
                {/* Video Placeholder Container */}
                <div className="w-full max-w-[500px] h-[250px] md:h-[300px] lg:h-[400px] mx-auto bg-gradient-to-br from-[#8bccc2] to-[#78b4aa] rounded-2xl border border-gray-200 dark:border-gray-700 flex items-center justify-center relative overflow-hidden cursor-pointer group"
                     onClick={() => setSelectedVideoIndex(currentFeature)}>
                  
                  {/* Video placeholder background pattern */}
                  <div className="absolute inset-0 bg-black/20">
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-32 h-20 bg-white/20 rounded-lg relative">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-4 h-4 bg-white rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Play Button Overlay */}
                  <div className="relative z-10 flex flex-col items-center space-y-2 md:space-y-4 group-hover:scale-110 transition-transform duration-300">
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
                      <Play className="w-8 h-8 md:w-10 md:h-10 text-white ml-1" fill="white" />
                    </div>
                    <div className="text-center">
                      <h3 className="text-white text-lg md:text-xl font-semibold mb-1 md:mb-2">{features[currentFeature].title}</h3>
                      <p className="text-white/80 text-xs md:text-sm">Click to watch video</p>
                    </div>
                  </div>

                  {/* Gradient Overlay for better text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </div>

      {/* Video Modal */}
      {selectedVideoIndex !== null && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative max-w-4xl w-full bg-white rounded-2xl p-8 shadow-2xl">
            <button
              onClick={() => setSelectedVideoIndex(null)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors z-20"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {features[selectedVideoIndex].title}
              </h3>
              
              {/* Large Video Placeholder */}
              <div className="relative bg-gradient-to-br from-[#8bccc2] to-[#78b4aa] rounded-2xl overflow-hidden shadow-2xl">
                <div className="aspect-video flex items-center justify-center relative">
                  {/* Video placeholder background pattern */}
                  <div className="absolute inset-0 bg-black/30">
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-32 h-20 bg-white/20 rounded-lg relative">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-4 h-4 bg-white rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Large Play Button */}
                  <div className="relative z-10 flex flex-col items-center space-y-4">
                    <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer">
                      <Play className="w-12 h-12 text-white ml-1" fill="white" />
                    </div>
                    <p className="text-white text-lg font-medium">Video Coming Soon</p>
                  </div>
                </div>
              </div>
              
              <p className="text-gray-600 mt-6 max-w-2xl mx-auto">
                {features[selectedVideoIndex].description}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
