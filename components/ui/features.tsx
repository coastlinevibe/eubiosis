"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Play, Pause, X, ChevronLeft, ChevronRight, ChevronDown, ArrowRight, RotateCcw, Home } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

// Video mapping for each illness
const videoMapping = {
  "Understanding IBS": {
    videoId: "U_3nn1O7GMw",
    title: "Understanding IBS",
    credit: "The Disease Encyclopedia"
  },
  "Metabolic Harmony Support": {
    videoId: "zBk4Xx4SQXg", 
    title: "Diabetes Support",
    credit: "The Disease Encyclopedia"
  },
  "Skin-Gut Connection": {
    videoId: "N9gekEsR6i0",
    title: "Skin Health",
    credit: "The Disease Encyclopedia"
  },
  "Lifestyle Balance Support": {
    videoId: "wikBB2BZCds",
    title: "Western Lifestyle",
    credit: "The Disease Encyclopedia"
  },
  "Immune System Support": {
    videoId: "iWTfGebVMQg",
    title: "Auto-Immune Support", 
    credit: "The Disease Encyclopedia"
  },
  "Digestive Comfort Support": {
    videoId: "pe9UlZHtp1U",
    title: "Digestive Health",
    credit: "The Disease Encyclopedia"
  }
};

// Quiz questions for each illness
const quizQuestions = {
  Diabetes: [
    {
      question: "Do you want steadier energy instead of afternoon sugar crashes?",
      options: ["Steady energy all day would be amazing", "Energy is improving slowly", "Still up and down most days", "Afternoons still crash me"]
    },
    {
      question: "Do you want your meals to keep you powered and calm?",
      options: ["Meals already keep me grounded", "Most meals feel balanced", "Only some meals keep me calm", "Meals still leave me jittery"]
    },
    {
      question: "Would you like your day to stop feeling like a sugar rollercoaster?",
      options: ["The rollercoaster finally slowed down", "Fewer drops lately", "Still some wild swings", "Feels like a rollercoaster every day"]
    },
    {
      question: "Do you want your gut cheering for balanced cravings all day?",
      options: ["Balanced cravings would feel liberating", "I'm starting to feel more in control", "Cravings win half the time", "I'm still fighting every craving"]
    }
  ],
  IBS: [
    {
      question: "How amazing would it feel to have meals that don't end in knots?",
      options: ["A chilled gut would be a blessing", "Even one calm meal would feel hopeful", "Some meals still end in knots", "Every meal still feels rough"]
    },
    {
      question: "What would predictable mornings mean for you?",
      options: ["Easy, pain-free starts again", "Even 1-2 steady mornings would help", "Most mornings are still a guess", "Mornings are the toughest part of my day"]
    },
    {
      question: "How ready are you to feel comfortable in your clothes again?",
      options: ["Yes please—comfort that lasts all day", "Most days feel okay but evenings are tricky", "Waistbands still change throughout the day", "Bloating keeps me changing outfits"]
    },
    {
      question: "How much would you value smoother days without meds?",
      options: ["It would be a blessing", "It means I can feel healthier", "More freedom to move around", "No meds means no discomfort"]
    }
  ],
  "Skin Health": [
    {
      question: "Do you want your glow to show up before the ring light?",
      options: ["My glow shows up on its own", "Glow is coming back", "Depends on the lighting", "Still waiting on that glow"]
    },
    {
      question: "Would you like your skin to feel calm when your schedule isn't?",
      options: ["Skin stays calm even during chaos", "Mostly calm with occasional flares", "Half calm, half reactive", "Still flares with stress"]
    },
    {
      question: "Do you want to selfie without checking for surprise filters?",
      options: ["Selfies feel fearless", "Usually comfortable snapping pics", "Depends on the day", "Still reach for filters first"]
    },
    {
      question: "Would you like your routine to feel simple, inside and out?",
      options: ["My routine feels simple inside and out", "Mostly simple with minor tweaks", "Some steps still feel complicated", "Still feels overwhelming"]
    }
  ],
  "Western Lifestyle": [
    {
      question: "Do you want energy that matches your ambitions?",
      options: ["Energy levels match my goals", "Most days I feel energized", "Energy comes and goes", "Still struggling with fatigue"]
    },
    {
      question: "Would you like your body to bounce back from busy days?",
      options: ["I recover quickly from stress", "Usually bounce back well", "Recovery takes some time", "Still feeling worn down"]
    },
    {
      question: "Do you want meals to fuel you instead of weighing you down?",
      options: ["Meals give me sustained energy", "Most meals feel nourishing", "Some meals still drag me down", "Food often makes me sluggish"]
    },
    {
      question: "Would you like your wellness routine to feel effortless?",
      options: ["Wellness feels natural now", "Most habits stick easily", "Some routines are challenging", "Still struggling with consistency"]
    }
  ],
  Autoimmune: [
    {
      question: "Do you want your body to feel like it's on your team?",
      options: ["My body feels like it's on my team", "Most days we're aligned", "Some flare days still pop up", "Still feels like a battle"]
    },
    {
      question: "Would you like to wake up ready instead of negotiating with creaks?",
      options: ["I wake up ready to roll", "Usually ready but cautious", "Depends on sleep and flares", "Still negotiating every morning"]
    },
    {
      question: "Do you want your calendar to have more adventures and fewer rain checks?",
      options: ["Adventures fit back in my calendar", "Most plans stick now", "Still cancel a few", "Still cancel more than I keep"]
    },
    {
      question: "Would you like your routine to feel balanced from brunch to bedtime?",
      options: ["Balanced from brunch to bedtime", "Mostly balanced with tiny wobbles", "Some wobble every day", "Days still feel uneven"]
    }
  ],
  "Digestive Issues": [
    {
      question: "Do you want a happy belly that stays quiet during date night?",
      options: ["Happy belly stays quiet", "Mostly calm with rare rumbles", "Some rumbling moments", "Still loud every night"]
    },
    {
      question: "Would you like meals that feel like hugs instead of question marks?",
      options: ["Every meal feels like a hug", "Most meals comfort me", "Some meals still question marks", "Meals still feel uncertain"]
    },
    {
      question: "Do you want to say yes to dessert without a pep talk?",
      options: ["I say yes to dessert without worry", "Usually yes with confidence", "Depends on the day", "Still need a pep talk"]
    },
    {
      question: "Would you like mornings that start smooth from coffee to commute?",
      options: ["Mornings start smooth from coffee on", "Mostly smooth with rare bumps", "Some rough starts linger", "Still rough most mornings"]
    }
  ],
  "Skin Conditions": [
    {
      question: "Do you want your glow to show up before the ring light?",
      options: ["My glow shows up on its own", "Glow is coming back", "Depends on the lighting", "Still waiting on that glow"]
    },
    {
      question: "Would you like your skin to feel calm when your schedule isn't?",
      options: ["Skin stays calm even during chaos", "Mostly calm with occasional flares", "Half calm, half reactive", "Still flares with stress"]
    },
    {
      question: "Do you want to selfie without checking for surprise filters?",
      options: ["Selfies feel fearless", "Usually comfortable snapping pics", "Depends on the day", "Still reach for filters first"]
    },
    {
      question: "Would you like your routine to feel simple, inside and out?",
      options: ["My routine feels simple inside and out", "Mostly simple with minor tweaks", "Some steps still feel complicated", "Still feels overwhelming"]
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
    heading: "Diabetes Support Through Gut Health",
    description: "Support your metabolic wellness journey with balanced gut bacteria that complement healthy lifestyle choices",
    features: [
      {
        id: 1,
        icon: "/images/Gut_Harmony_Restored.png?v=2",
        title: "Metabolic Harmony Support",
        description: "Eubiosis-S supports healthy metabolic function through balanced gut bacteria as part of a healthy lifestyle.",
        image: "/images/hands.png",
      },
      {
        id: 2,
        icon: "/images/42_Beneficial_Strains.png?v=2",
        title: "Metabolic Support Strains",
        description: "Our beneficial strains help support healthy glucose metabolism when combined with proper diet and exercise.",
        image: "/images/bottles/bottle-s.png",
      },
      {
        id: 3,
        icon: "/images/Natural_Delivery_System.png?v=2",
        title: "Gentle Daily Support",
        description: "Organic honey delivery ensures our beneficial strains reach your gut to support overall metabolic wellness.",
        image: "/images/bottles/bottle-combo.png",
      },
    ]
  },
  IBS: {
    tagline: "Digestive Support. Gentle Comfort.",
    heading: "IBS Support with Eubiosis-S",
    description: "Support digestive comfort and balance with beneficial bacteria that help promote gut harmony",
    features: [
      {
        id: 0,
        icon: "/images/Gut_Harmony_Restored.png?v=2",
        title: "Understanding IBS",
        description:
          "IBS often involves gut bacteria imbalance that affects digestion. Stress, antibiotics, infections, and dietary changes can influence symptoms. Supporting microbial balance helps promote digestive comfort and overall gut wellness.",
        image: "/images/hands.png",
      },
      {
        id: 1,
        icon: "/images/Gut_Harmony_Restored.png?v=2",
        title: "Digestive Comfort Support",
        description: "Our beneficial strains help support digestive comfort and promote balanced gut function as part of a healthy lifestyle.",
        image: "/images/hands.png",
      },
    ]
  },
  "Skin Health": {
    tagline: "Clear Skin. Gut-Based Beauty.",
    heading: "Skin Health Through Gut Balance",
    description: "Support clearer, healthier skin by nurturing the gut-skin connection with balanced microbiome support",
    features: [
      {
        id: 1,
        icon: "/images/Gut_Harmony_Restored.png?v=2",
        title: "Skin-Gut Connection",
        description: "Eubiosis-S supports the gut-skin axis, helping promote skin health from the inside out through balanced gut bacteria.",
        image: "/images/hands.png",
      },
      {
        id: 2,
        icon: "/images/42_Beneficial_Strains.png?v=2",
        title: "Skin-Supporting Strains",
        description: "Our beneficial strains help support healthy inflammatory response and skin barrier function.",
        image: "/images/bottles/bottle-s.png",
      },
      {
        id: 3,
        icon: "/images/Natural_Delivery_System.png?v=2",
        title: "Beauty from Within",
        description: "Honey delivery provides gentle support for comprehensive skin wellness through gut health.",
        image: "/images/bottles/bottle-combo.png",
      },
    ]
  },
  "Western Lifestyle": {
    tagline: "Balanced Living. Natural Vitality.",
    heading: "Western Lifestyle Support",
    description: "Support your body's natural balance in our fast-paced world with comprehensive gut health support",
    features: [
      {
        id: 1,
        icon: "/images/Gut_Harmony_Restored.png?v=2",
        title: "Lifestyle Balance Support",
        description: "Eubiosis-S helps support your body's natural resilience against the stresses of modern living through gut balance.",
        image: "/images/hands.png",
      },
      {
        id: 2,
        icon: "/images/42_Beneficial_Strains.png?v=2",
        title: "Energy & Vitality Strains",
        description: "Our beneficial bacteria support natural energy levels and overall vitality for busy lifestyles.",
        image: "/images/bottles/bottle-s.png",
      },
      {
        id: 3,
        icon: "/images/Natural_Delivery_System.png?v=2",
        title: "Gentle Daily Support",
        description: "Honey-based delivery provides gentle, consistent support for maintaining wellness in demanding schedules.",
        image: "/images/bottles/bottle-combo.png",
      },
    ]
  },
  Autoimmune: {
    tagline: "Immune Balance. Natural Support.",
    heading: "Autoimmune Support with Eubiosis-S",
    description: "Support your immune system naturally with beneficial bacteria that help promote immune balance",
    features: [
      {
        id: 1,
        icon: "/images/Gut_Harmony_Restored.png?v=2",
        title: "Immune System Support",
        description: "Eubiosis-S supports healthy immune function through balanced gut bacteria as part of overall wellness.",
        image: "/images/hands.png",
      },
      {
        id: 2,
        icon: "/images/42_Beneficial_Strains.png?v=2",
        title: "Balance-Supporting Strains",
        description: "Our beneficial strains help support healthy inflammatory response and immune system balance.",
        image: "/images/bottles/bottle-s.png",
      },
      {
        id: 3,
        icon: "/images/Natural_Delivery_System.png?v=2",
        title: "Gentle Daily Support",
        description: "Organic honey delivery provides gentle support for immune wellness alongside a healthy lifestyle.",
        image: "/images/bottles/bottle-combo.png",
      },
    ]
  },
  "Digestive Issues": {
    tagline: "Complete Digestive Support. Natural Wellness.",
    heading: "Comprehensive Digestive Support",
    description: "Support digestive wellness with beneficial bacteria that help promote overall gut comfort and balance",
    features: [
      {
        id: 1,
        icon: "/images/Gut_Harmony_Restored.png?v=2",
        title: "Digestive Comfort Support",
        description: "Eubiosis-S helps support digestive comfort and promote balanced gut function as part of healthy living.",
        image: "/images/hands.png",
      },
      {
        id: 2,
        icon: "/images/42_Beneficial_Strains.png?v=2",
        title: "Full-Spectrum Support",
        description: "Comprehensive blend of beneficial bacteria that support various aspects of digestive wellness.",
        image: "/images/bottles/bottle-s.png",
      },
      {
        id: 3,
        icon: "/images/Natural_Delivery_System.png?v=2",
        title: "Optimal Delivery",
        description: "Honey-based delivery helps ensure beneficial strains reach your gut to support digestive balance.",
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
        description: "Eubiosis-S supports the gut-skin axis, helping clear skin conditions from the inside out.",
        image: "/images/hands.png",
      },
      {
        id: 2,
        icon: "/images/42_Beneficial_Strains.png?v=2",
        title: "Skin-Clearing Strains",
        description: "Our strains reduce inflammation and support healthy skin barrier function.",
        image: "/images/bottles/bottle-s.png",
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
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
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

  const illnesses = ['IBS', 'Diabetes', 'Skin Health', 'Western Lifestyle', 'Autoimmune', 'Digestive Issues'];

  // Audio toggle function
  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  // Handle audio ended
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      const handleEnded = () => setIsPlaying(false);
      audio.addEventListener('ended', handleEnded);
      return () => audio.removeEventListener('ended', handleEnded);
    }
  }, []);

  const doodleBackgroundStyle = {
    backgroundImage:
      "linear-gradient(rgba(246,242,234,0.90), rgba(246,242,234,0.90)), url(/images/webbg.jpg)",
    backgroundSize: '300px',
    backgroundPosition: 'center',
    backgroundRepeat: 'repeat',
  } as const;

  // Get content based on selected illness, fallback to default if no illness selected
  const currentContent = illness ? illnessContent[illness as keyof typeof illnessContent] : {
    tagline: "Natural Gut Health. Real Results.",
    heading: "What is Eubiosis-S?",
    description: "Discover what makes our formula exceptional with these certified benefits",
    features: [
      {
        id: 1,
        icon: "/images/Gut_Harmony_Restored.png?v=2",
        title: "Gut Harmony Restored",
        description:
          "Eubiosis-S represents the perfect balance of your body's microbial ecosystem. When beneficial bacteria thrive, you experience optimal health and vitality.",
        image: "/images/hands.png",
      },
      {
        id: 2,
        icon: "/images/42_Beneficial_Strains.png?v=2",
        title: "42 Beneficial Strains",
        description:
          "Our advanced formula contains 42 carefully selected beneficial bacterial strains, suspended in pure organic honey for maximum effectiveness.",
        image: "/images/bottles/bottle-s.png",
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

  // Disable auto-cycling globally
  const autoCycle = false;

  useEffect(() => {
    if (!autoCycle) return;
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 100 : prev + 0.1));
    }, 10);
    return () => clearInterval(interval);
  }, [autoCycle]);

  useEffect(() => {
    if (!autoCycle) return;
    if (progress >= 100) {
      setTimeout(() => {
        setCurrentFeature((prev) => (prev + 1) % features.length);
        setProgress(0);
      }, 200);
    }
  }, [progress, autoCycle, features.length]);

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
      // Higher scores for answers that suggest Eubiosis-S would be more beneficial
      if (index === 0) return total + (quizAnswers[0] === "More than 5 years" ? 3 : quizAnswers[0] === "3-5 years" ? 2 : 1);
      if (index === 1) return total + (answer === "Often" ? 3 : answer === "Sometimes" ? 2 : 1);
      if (index === 2) return total + (answer === "Never" || answer === "Yes, with no results" ? 3 : 2);
      if (index === 3) return total + (answer === "Poor" ? 3 : answer === "Fair" ? 2 : 1);
      return total;
    }, 0);

    if (score >= 10) return { match: "Excellent", message: "Eubiosis-S appears to be an excellent fit for your needs!" };
    if (score >= 7) return { match: "Good", message: "Eubiosis-S could be very beneficial for your situation." };
    if (score >= 5) return { match: "Moderate", message: "Eubiosis-S helps, though results vary." };
    return { match: "Limited", message: "Eubiosis-S might provide some benefits, but consider consulting with a healthcare provider." };
  };

  return (
    <div
      ref={sectionRef}
      className={`${illness ? 'pt-14 pb-16 px-4' : 'pt-0 pb-16 px-4 -mt-16'}`}
      style={doodleBackgroundStyle}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          className={`${illness ? 'flex flex-col items-center text-center space-y-2 mb-8 md:mb-16' : 'grid lg:grid-cols-[3fr_auto_1fr] grid-cols-1 gap-4 md:gap-8 items-center -mb-24'}`}
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
                className="text-left flex flex-col justify-center"
                initial={{ opacity: 0, x: -50 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              >
                <span className={`text-[#8bccc2] font-semibold text-sm uppercase tracking-wider block mb-4`}>
                  {currentContent.tagline}
                </span>
                <h2 className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl font-bold text-text leading-tight">
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

              {/* Right Side - Image Box with Voice Recording */}
              <motion.div 
                className="text-left lg:text-right mt-0 lg:mt-[100px] pb-16 md:pb-24 lg:pb-0"
                initial={{ opacity: 0, x: 50 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
                transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
              >
                <div className="relative bg-white rounded-2xl p-3 border border-gray-200 lg:scale-150 lg:-translate-x-40 lg:translate-y-64">
                  {/* Image Container */}
                  <div className="relative aspect-video bg-gradient-to-br from-[#8bccc2] to-[#78b4aa] rounded-xl overflow-hidden mb-4">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <img 
                        src="/images/scatman.jpg" 
                        alt="Scatman" 
                        className="w-32 h-auto drop-shadow-lg"
                      />
                    </div>
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </div>
                  
                  {/* Voice Recording Button */}
                  <div className="flex items-center justify-center">
                    <button 
                      onClick={toggleAudio}
                      className="group flex items-center gap-3 bg-white hover:bg-[#8bccc2] text-[#8bccc2] hover:text-white px-6 py-3 rounded-[11px] border border-[#8bccc2] transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      <div className="relative">
                        {isPlaying ? (
                          <Pause className="w-5 h-5" />
                        ) : (
                          <Play className="w-5 h-5" />
                        )}
                        <div className={`absolute -inset-1 bg-current opacity-20 rounded-full ${isPlaying ? 'animate-pulse' : 'animate-pulse group-hover:animate-none'}`}></div>
                      </div>
                      <span className="font-medium text-sm">
                        {isPlaying ? 'Pause: What is Eubiosis-S?' : 'Listen: What is Eubiosis-S?'}
                      </span>
                    </button>
                    {/* Hidden audio element */}
                    <audio ref={audioRef} preload="metadata">
                      <source src="/audio/eub.mp3" type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                  
                  {/* Description below */}
                  <p className="text-xs text-center text-gray-600 mt-3 leading-relaxed">
                    {currentContent.description}
                  </p>
                </div>
              </motion.div>
            </>
          )}
        </motion.div>

        {/* Mobile: Show carousel navigation at top */}
        {illness && cycling && (
          <motion.div 
            className="lg:hidden mb-6 w-full"
            initial={{ opacity: 0, y: -30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -30 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            <div className="relative">
              <div className="flex items-center justify-between bg-white/80 backdrop-blur-sm rounded-lg px-4 py-3 shadow-lg border border-[#8bccc2]/20">
                <motion.button 
                  className="p-2 rounded-full hover:bg-[#8bccc2]/20 transition-colors"
                  onClick={onPrevIllness}
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
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ChevronRight className="w-5 h-5 text-[#8bccc2]" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        <div className={`grid grid-cols-1 lg:grid-cols-2 lg:gap-8 gap-6 items-start ${illness ? 'mt-12' : 'mt-8'}`}>
          {/* Left Side - Scrollable Content */}
          <motion.div 
            className="space-y-2"
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          >
            {/* Scrollable Content Container */}
            <div className="h-auto md:h-[390px] overflow-y-auto pr-4 space-y-2 scrollbar-thin scrollbar-thumb-[#8bccc2] scrollbar-track-gray-100 scrollbar-w-2">
              
              {/* Feature Text List */}
              {features.map((feature, index) => {
                const isActive = currentFeature === index;
                const tealTitles = [
                  "What Causes IBS?",
                  "IBS Symptom Relief",
                  "Gut Motility Strains"
                ];
                const isTealTitle = tealTitles.includes(feature.title);

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
                      <h3 className={`text-lg font-semibold mb-2 ${isTealTitle ? 'text-[#4AAE9B]' : isActive ? 'text-[#8bccc2]' : 'text-gray-900'}`}>
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
                <h4 className="text-base font-semibold text-[#4AAE9B] mb-3">Why Choose Eubiosis-S Supplement?</h4>
                <p className="text-gray-600 text-sm leading-relaxed mb-3">
                  Eubiosis-S Supplement combines the power of fulvic and humic acids — natural compounds that help the body restore internal balance. It supports your system by:
                </p>
                <ul className="list-disc list-inside text-gray-600 text-sm leading-relaxed space-y-1">
                  <li><span className="font-medium">Detoxifying:</span> helping eliminate accumulated toxins and heavy metals</li>
                  <li><span className="font-medium">Antioxidant action:</span> counteracting the effects of free radicals</li>
                  <li><span className="font-medium">Immune support:</span> promoting antibody activity and strengthening natural defenses</li>
                  <li><span className="font-medium">Microbial balance:</span> discouraging the growth of harmful bacteria</li>
                </ul>
              </motion.div>

              {/* Scientific Research - Plain Text */}
              <motion.div 
                className="pt-6 mt-6"
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.6, delay: 1.0, ease: "easeOut" }}
              >
                <h4 className="text-base font-semibold text-[#4AAE9B] mb-3">Scientific Research</h4>
                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                  Our formula is backed by extensive research on the gut microbiome and its impact on overall health. 
                  Studies show that diverse probiotic strains can significantly improve digestive health and immune function.
                </p>
              </motion.div>

            </div>
          </motion.div>

          {/* Right Side - Quiz + Video Side by Side */}
          {illness && videoMapping[features[currentFeature].title as keyof typeof videoMapping] ? (
            <div className="relative order-1 w-full max-w-full mx-auto lg:order-2">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Quiz Section - Left Side */}
                <div className="flex-1 bg-gradient-to-br from-[#8bccc2] to-[#78b4aa] rounded-2xl border border-gray-200 dark:border-gray-700 p-6 text-center h-auto md:h-[280px] relative">
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
                        Discover how gut balance supports your {illness} wellness journey.

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
                            <p className="text-white text-sm font-medium mb-4">
                              We support your "balanced gut" days!
                            </p>
                            <div className="flex gap-2 justify-center">
                              <button 
                                onClick={() => window.location.href = '/oto?bundle=false&email=false&size=50ml&quantity=1&tookBigOffer=false'}
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
                    <div className="w-full h-auto md:h-[280px] bg-gradient-to-br from-[#8bccc2] to-[#78b4aa] rounded-2xl border border-gray-200 dark:border-gray-700 flex items-center justify-center relative overflow-hidden cursor-pointer group"
                         onClick={() => setSelectedVideoIndex(currentFeature)}>
                      
                      {/* Video background - YouTube thumbnail only */}
                      {videoMapping[features[currentFeature].title as keyof typeof videoMapping] && (
                        <div className="absolute inset-0">
                          <img 
                            src={`https://img.youtube.com/vi/${videoMapping[features[currentFeature].title as keyof typeof videoMapping].videoId}/maxresdefault.jpg`}
                            alt={`${videoMapping[features[currentFeature].title as keyof typeof videoMapping].title} Video Thumbnail`}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/30"></div>
                        </div>
                      )}

                      {/* Play Button Overlay */}
                      <div className="relative z-10 flex flex-col items-center space-y-2 group-hover:scale-110 transition-transform duration-300">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
                          <Play className="w-8 h-8 text-white ml-1" fill="white" />
                        </div>
                        <div className="text-center">
                          <h3 className="text-white text-lg font-semibold mb-1">{features[currentFeature].title}</h3>
                          {videoMapping[features[currentFeature].title as keyof typeof videoMapping] && (
                            <p className="text-white/80 text-xs">Click to watch video</p>
                          )}
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
                <div className="flex flex-row gap-3 justify-center items-center flex-wrap lg:flex-nowrap">
                  {/* Show carousel only when cycling - Desktop only */}
                  {cycling && (
                    <>
                      {/* Carousel Navigation - Hidden on mobile */}
                      <div className="hidden lg:block relative">
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
                        className="inline-flex items-center justify-center gap-3 px-4 sm:px-5 py-2 sm:py-3 rounded-[9px] border border-[#8bccc2]/50 bg-gradient-to-r from-black via-black to-[#8bccc2]/20 text-white shadow-[0_10px_30px_rgba(0,0,0,0.35)] hover:from-black/90 hover:via-black/90 hover:to-[#8bccc2]/30 transition-all duration-300 text-sm sm:text-base whitespace-nowrap"
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
                      className="inline-flex items-center justify-center gap-3 px-4 sm:px-5 py-2 sm:py-3 rounded-[9px] border border-[#8bccc2]/50 bg-gradient-to-r from-black via-black to-[#8bccc2]/20 text-white shadow-[0_10px_30px_rgba(0,0,0,0.35)] hover:from-black/90 hover:via-black/90 hover:to-[#8bccc2]/30 transition-all duration-300 text-sm sm:text-base whitespace-nowrap"
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
                    className="btn-secondary p-2 sm:p-3 flex items-center gap-2 text-sm sm:text-base whitespace-nowrap"
                    onClick={onResetToHero}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.6, delay: cycling ? 1.6 : 1.8, ease: "easeOut" }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Home className="w-4 sm:w-5 h-4 sm:h-5" />
                    <span>Home Page</span>
                    <span aria-hidden="true"></span>
                  </motion.button>
                </div>
              </motion.div>
            </div>
          ) : null}
        </div>
      </div>

      {/* Video Modal */}
      {selectedVideoIndex !== null && videoMapping[features[selectedVideoIndex].title as keyof typeof videoMapping] && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative max-w-4xl w-full bg-white rounded-2xl p-8 shadow-2xl">
            <button
              onClick={() => setSelectedVideoIndex(null)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors z-20"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {features[selectedVideoIndex].title}
              </h3>
              
              {/* Credit Notice */}
              {videoMapping[features[selectedVideoIndex].title as keyof typeof videoMapping] && (
                <p className="text-sm text-gray-600 mb-4">
                  Video courtesy of <span className="font-medium">{videoMapping[features[selectedVideoIndex].title as keyof typeof videoMapping].credit}</span> YouTube channel
                </p>
              )}
              
              {/* Video Content */}
              {videoMapping[features[selectedVideoIndex].title as keyof typeof videoMapping] ? (
                /* YouTube Video Embed */
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <div className="aspect-video">
                    <iframe
                      src={`https://www.youtube.com/embed/${videoMapping[features[selectedVideoIndex].title as keyof typeof videoMapping].videoId}`}
                      title={videoMapping[features[selectedVideoIndex].title as keyof typeof videoMapping].title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      className="w-full h-full"
                    ></iframe>
                  </div>
                </div>
              ) : (
                /* Video Placeholder for other videos */
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
                    </div>
                  </div>
                </div>
              )}
              
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
