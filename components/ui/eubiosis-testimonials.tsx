"use client"

import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Marquee } from '@/components/ui/3d-testimonials';
import { TestimonialPopup } from '@/components/ui/testimonial-popup';

// Eubiosis testimonials data
const testimonials = [
  {
    name: 'Sarah Johnson',
    username: '@sarah_j',
    body: 'Eubiosis transformed my gut health completely!',
    fullText: 'After struggling with digestive issues for years, Eubiosis has been a game-changer. Within just two weeks of taking it daily, I noticed significant improvements in my digestion, energy levels, and overall well-being. The honey-based formula is gentle yet effective, and I love knowing that I\'m supporting my gut microbiome with 42 beneficial strains. This is now a permanent part of my wellness routine!',
    img: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    country: '🇺🇸 USA',
  },
  {
    name: 'Emma Wilson',
    username: '@emma_w',
    body: 'Amazing results in just 2 weeks!',
    fullText: 'I was skeptical about probiotics until I tried Eubiosis. The natural honey delivery system makes such a difference - no more stomach upset from harsh capsules. My bloating disappeared, my skin cleared up, and I have more energy than I\'ve had in years. The fact that it contains 42 different strains gives me confidence that I\'m getting comprehensive gut support.',
    img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    country: '🇬🇧 UK',
  },
  {
    name: 'Michael Chen',
    username: '@mike_c',
    body: 'Best probiotic I\'ve ever tried!',
    fullText: 'As someone who has tried countless probiotics over the years, Eubiosis stands out for its quality and effectiveness. The honey-based formula is brilliant - it tastes great and seems to help the beneficial bacteria survive better. My digestive health has never been better, and I\'ve noticed improvements in my mood and mental clarity too. Highly recommend to anyone serious about gut health.',
    img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    country: '🇨🇦 Canada',
  },
  {
    name: 'Lisa Rodriguez',
    username: '@lisa_r',
    body: 'My energy levels have skyrocketed!',
    fullText: 'I started taking Eubiosis three months ago after reading about the gut-brain connection. The results have exceeded my expectations. Not only has my digestion improved dramatically, but my energy levels are through the roof. I used to experience afternoon crashes, but now I maintain steady energy throughout the day. The natural honey base makes it a pleasure to take daily.',
    img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
    country: '🇪🇸 Spain',
  },
  {
    name: 'David Thompson',
    username: '@david_t',
    body: 'Natural and effective solution!',
    fullText: 'After years of digestive problems and trying various treatments, Eubiosis has been the natural solution I was looking for. The combination of 42 bacterial strains in a honey base is genius - it\'s gentle on the stomach and incredibly effective. My gut health has improved dramatically, and I\'ve noticed better sleep quality and reduced stress levels too.',
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    country: '🇦🇺 Australia',
  },
  {
    name: 'Maria Santos',
    username: '@maria_s',
    body: 'Gentle yet powerful formula!',
    fullText: 'What I love most about Eubiosis is how gentle it is on my sensitive stomach while still being incredibly effective. The honey delivery system is brilliant - no more harsh capsules that upset my digestion. Within a month, my bloating disappeared, my skin cleared up, and I felt more energetic. It\'s become an essential part of my daily wellness routine.',
    img: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop&crop=face',
    country: '🇧🇷 Brazil',
  },
  {
    name: 'James Park',
    username: '@james_p',
    body: '42 strains make all the difference!',
    fullText: 'The diversity of bacterial strains in Eubiosis is what convinced me to try it, and I\'m so glad I did. Having 42 different beneficial strains means comprehensive gut support like I\'ve never experienced before. My digestion is perfect now, my immune system feels stronger, and even my mental clarity has improved. This is the future of probiotic supplementation.',
    img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    country: '🇰🇷 South Korea',
  },
  {
    name: 'Anna Kowalski',
    username: '@anna_k',
    body: 'Life-changing gut health support!',
    fullText: 'Eubiosis has literally changed my life. I suffered from IBS for years, trying everything from elimination diets to prescription medications. Nothing worked until I discovered Eubiosis. The natural honey formula is so much easier on my system than other probiotics, and the results speak for themselves. My symptoms have virtually disappeared, and I feel like myself again.',
    img: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face',
    country: '🇵🇱 Poland',
  },
  {
    name: 'Robert Kim',
    username: '@rob_k',
    body: 'Perfect for sensitive stomachs!',
    fullText: 'Having a sensitive stomach made it difficult to find a probiotic that didn\'t cause more problems than it solved. Eubiosis changed everything. The honey-based delivery system is incredibly gentle, and I\'ve experienced zero side effects while getting all the benefits of 42 beneficial strains. My digestion has never been better, and I finally have the energy I need for my active lifestyle.',
    img: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face',
    country: '🇯🇵 Japan',
  },
];

interface TestimonialCardProps {
  testimonial: typeof testimonials[0];
  onClick: () => void;
}

function TestimonialCard({ testimonial, onClick }: TestimonialCardProps) {
  return (
    <Card 
      className="w-80 cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105"
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="w-12 h-12">
            <AvatarImage src={testimonial.img} alt={testimonial.name} />
            <AvatarFallback>{testimonial.name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <div className="text-base font-medium text-foreground flex items-center gap-1">
              {testimonial.name} <span className="text-sm">{testimonial.country}</span>
            </div>
            <p className="text-sm font-medium text-muted-foreground">{testimonial.username}</p>
          </div>
        </div>
        <blockquote className="text-base text-gray-700 line-clamp-4 leading-relaxed">
          "{testimonial.body}"
        </blockquote>
        <div className="mt-3 text-sm text-[#8bccc2] hover:text-[#78b4aa] font-medium">
          Click to read more & listen →
        </div>
      </CardContent>
    </Card>
  );
}

export default function EubiosisTestimonials() {
  const [selectedTestimonial, setSelectedTestimonial] = useState<typeof testimonials[0] | null>(null);

  return (
    <>
      <div className="relative flex h-[750px] w-full flex-row items-center justify-center overflow-hidden gap-1.5 [perspective:300px]">
        <div
          className="flex flex-row items-center gap-6"
          style={{
            transform:
              'translateX(-100px) translateY(0px) translateZ(-100px) rotateX(20deg) rotateY(-10deg) rotateZ(20deg)',
          }}
        >
          {/* Vertical Marquee (downwards) */}
          <Marquee vertical pauseOnHover repeat={3} className="[--duration:40s]">
            {testimonials.map((testimonial) => (
              <TestimonialCard 
                key={testimonial.username} 
                testimonial={testimonial}
                onClick={() => setSelectedTestimonial(testimonial)}
              />
            ))}
          </Marquee>
          {/* Vertical Marquee (upwards) */}
          <Marquee vertical pauseOnHover reverse repeat={3} className="[--duration:40s]">
            {testimonials.map((testimonial) => (
              <TestimonialCard 
                key={testimonial.username} 
                testimonial={testimonial}
                onClick={() => setSelectedTestimonial(testimonial)}
              />
            ))}
          </Marquee>
          {/* Vertical Marquee (downwards) */}
          <Marquee vertical pauseOnHover repeat={3} className="[--duration:40s]">
            {testimonials.map((testimonial) => (
              <TestimonialCard 
                key={testimonial.username} 
                testimonial={testimonial}
                onClick={() => setSelectedTestimonial(testimonial)}
              />
            ))}
          </Marquee>
          {/* Vertical Marquee (upwards) */}
          <Marquee vertical pauseOnHover reverse repeat={3} className="[--duration:40s]">
            {testimonials.map((testimonial) => (
              <TestimonialCard 
                key={testimonial.username} 
                testimonial={testimonial}
                onClick={() => setSelectedTestimonial(testimonial)}
              />
            ))}
          </Marquee>
          {/* Vertical Marquee (downwards) - Second Row */}
          <Marquee vertical pauseOnHover repeat={3} className="[--duration:45s]">
            {testimonials.map((testimonial) => (
              <TestimonialCard 
                key={`${testimonial.username}-second`} 
                testimonial={testimonial}
                onClick={() => setSelectedTestimonial(testimonial)}
              />
            ))}
          </Marquee>
          {/* Vertical Marquee (upwards) - Second Row */}
          <Marquee vertical pauseOnHover reverse repeat={3} className="[--duration:45s]">
            {testimonials.map((testimonial) => (
              <TestimonialCard 
                key={`${testimonial.username}-second-up`} 
                testimonial={testimonial}
                onClick={() => setSelectedTestimonial(testimonial)}
              />
            ))}
          </Marquee>
        </div>
        
        {/* Gradient overlays for vertical marquee */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-background"></div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-background"></div>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background"></div>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background"></div>
      </div>

      {/* Testimonial Popup */}
      {selectedTestimonial && (
        <TestimonialPopup
          isOpen={!!selectedTestimonial}
          onClose={() => setSelectedTestimonial(null)}
          testimonial={selectedTestimonial}
        />
      )}
    </>
  );
}
