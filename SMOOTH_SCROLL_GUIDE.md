# Smooth Scroll & Scroll Animations Guide

## 🎨 Overview

Your portfolio now features **Lenis smooth scrolling** and **scroll-triggered animations** inspired by rockstargames.com and lenis.darkroom.engineering!

## ✨ What's New

### 1. **Lenis Smooth Scrolling**
- Buttery smooth scroll experience
- Natural easing and momentum
- Works on all devices
- Optimized performance

### 2. **Scroll-Triggered Animations**
- Text appears as you scroll down
- Elements fade out smoothly when leaving viewport
- Parallax effects
- Scale animations
- Split text reveals

### 3. **Creative Showcase Section**
- Full-screen sections
- Animated hero text
- Feature cards with scroll effects
- Tech stack showcase
- Parallax backgrounds

## 📦 Installed Packages

```bash
npm install lenis
```

## 📁 New Files Created

### 1. `src/components/SmoothScrollProvider.tsx`
Wraps the entire app with Lenis smooth scrolling.

**Configuration:**
```typescript
duration: 1.2,           // Scroll duration
easing: custom,          // Smooth easing function
smoothWheel: true,       // Smooth mouse wheel
wheelMultiplier: 1,      // Scroll speed
```

### 2. `src/components/ScrollReveal.tsx`
Collection of scroll animation components:

#### **ScrollReveal**
Reveals elements from any direction:
```tsx
<ScrollReveal direction="up" delay={0.2}>
  <div>Content appears from bottom</div>
</ScrollReveal>
```

**Props:**
- `direction`: "up" | "down" | "left" | "right"
- `delay`: number (seconds)
- `duration`: number (seconds)

#### **ScrollFade**
Fades in/out based on scroll position:
```tsx
<ScrollFade>
  <div>Fades in and out smoothly</div>
</ScrollFade>
```

#### **ParallaxText**
Creates parallax effect:
```tsx
<ParallaxText speed={0.5}>
  <h2>Moves at different speed</h2>
</ParallaxText>
```

**Props:**
- `speed`: number (0.5 = half speed, 2 = double speed)

#### **SplitTextReveal**
Reveals text word by word:
```tsx
<SplitTextReveal 
  text="This text appears word by word"
  delay={0.3}
/>
```

#### **ScrollScale**
Scales elements on scroll:
```tsx
<ScrollScale>
  <div>Scales up and down</div>
</ScrollScale>
```

### 3. `src/components/CreativeShowcase.tsx`
Full showcase section with multiple scroll effects.

## 🎯 How It Works

### Smooth Scrolling
```typescript
// Lenis initialization
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
});

// Animation loop
function raf(time: number) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
```

### Scroll Animations
```typescript
// Using Framer Motion
const isInView = useInView(ref, { 
  once: false,        // Animate every time
  margin: "-100px"    // Trigger offset
});

// Scroll progress
const { scrollYProgress } = useScroll({
  target: ref,
  offset: ["start end", "end start"]
});

// Transform values
const opacity = useTransform(
  scrollYProgress, 
  [0, 0.3, 0.7, 1], 
  [0, 1, 1, 0]
);
```

## 🎨 Animation Types

### 1. **Fade In/Out**
Elements fade based on viewport position:
- Fade in when entering
- Stay visible in viewport
- Fade out when leaving

### 2. **Slide In**
Elements slide from any direction:
- Up, Down, Left, Right
- Customizable distance
- Smooth easing

### 3. **Parallax**
Elements move at different speeds:
- Background moves slower
- Foreground moves faster
- Creates depth

### 4. **Scale**
Elements scale up/down:
- Zoom in when entering
- Zoom out when leaving
- Smooth transitions

### 5. **Split Text**
Text reveals word by word:
- Sequential animation
- Customizable delay
- Natural reading flow

## 🎬 Usage Examples

### Basic Reveal
```tsx
import { ScrollReveal } from "@/components/ScrollReveal";

<ScrollReveal direction="up">
  <h2>This appears from bottom</h2>
</ScrollReveal>
```

### Parallax Section
```tsx
import { ParallaxText } from "@/components/ScrollReveal";

<ParallaxText speed={0.5}>
  <h1>Slow moving title</h1>
</ParallaxText>
```

### Fade Effect
```tsx
import { ScrollFade } from "@/components/ScrollReveal";

<ScrollFade>
  <div>Fades in and out</div>
</ScrollFade>
```

### Split Text
```tsx
import { SplitTextReveal } from "@/components/ScrollReveal";

<SplitTextReveal 
  text="Your amazing headline here"
  className="text-4xl font-bold"
  delay={0.2}
/>
```

### Scale Animation
```tsx
import { ScrollScale } from "@/components/ScrollReveal";

<ScrollScale>
  <div className="card">
    Scales on scroll
  </div>
</ScrollScale>
```

## 🎨 Creative Showcase Sections

### 1. **Hero Section**
- Full-screen height
- Parallax background
- Animated title
- Split text subtitle

### 2. **Feature Sections**
- Alternating layouts
- Parallax text
- Scale animations
- Gradient cards

### 3. **Tech Stack**
- Grid layout
- Staggered reveals
- Hover effects
- Icon animations

### 4. **CTA Section**
- Centered content
- Scale animation
- Split text
- Gradient button

## ⚙️ Configuration

### Adjust Scroll Speed
In `SmoothScrollProvider.tsx`:
```typescript
duration: 1.2,  // Lower = faster, Higher = slower
```

### Adjust Animation Timing
In scroll components:
```typescript
duration: 0.8,  // Animation duration
delay: 0.2,     // Start delay
```

### Adjust Trigger Points
```typescript
margin: "-100px"  // Trigger 100px before entering viewport
```

### Adjust Parallax Speed
```typescript
speed: 0.5  // 0.5 = half speed, 2 = double speed
```

## 🎯 Best Practices

### 1. **Performance**
- Use `once: false` sparingly
- Limit number of animated elements
- Use CSS transforms (not position)
- Avoid animating expensive properties

### 2. **Timing**
- Keep animations under 1 second
- Use delays for sequential reveals
- Match animation speed to scroll speed

### 3. **Accessibility**
- Respect `prefers-reduced-motion`
- Provide fallbacks
- Don't rely solely on animations

### 4. **Mobile**
- Test on mobile devices
- Adjust speeds for touch
- Consider disabling some effects

## 🐛 Troubleshooting

### Scroll Not Smooth
- Check if Lenis is initialized
- Verify no conflicting scroll libraries
- Check browser console for errors

### Animations Not Triggering
- Verify element is in viewport
- Check margin/offset values
- Ensure `useInView` is working

### Performance Issues
- Reduce number of animated elements
- Use `once: true` where possible
- Simplify complex animations

### Mobile Issues
- Test on actual devices
- Adjust `smoothTouch` setting
- Consider disabling on mobile

## 🎨 Customization

### Change Easing
```typescript
easing: (t) => t * t * (3 - 2 * t)  // Custom easing
```

### Change Animation Direction
```typescript
<ScrollReveal direction="left">  // From left
<ScrollReveal direction="right"> // From right
```

### Change Fade Range
```typescript
const opacity = useTransform(
  scrollYProgress,
  [0, 0.2, 0.8, 1],  // Adjust these values
  [0, 1, 1, 0]
);
```

## 📊 Performance Metrics

### Target Metrics
- **FPS**: 60fps smooth scrolling
- **Animation Duration**: < 1 second
- **Trigger Delay**: < 100ms
- **Memory**: Minimal overhead

### Optimization Tips
1. Use `will-change` CSS property
2. Limit simultaneous animations
3. Use `transform` and `opacity` only
4. Debounce scroll events if needed

## 🎉 Examples in Your Portfolio

### Homepage
- Hero section with parallax
- Feature sections with reveals
- Tech stack with staggered animations

### Creative Showcase
- Full-screen sections
- Parallax backgrounds
- Split text reveals
- Scale animations
- Fade effects

## 🔧 Advanced Usage

### Custom Animation
```tsx
const ref = useRef(null);
const { scrollYProgress } = useScroll({
  target: ref,
  offset: ["start end", "end start"]
});

const x = useTransform(scrollYProgress, [0, 1], [-100, 100]);
const rotate = useTransform(scrollYProgress, [0, 1], [0, 360]);

<motion.div ref={ref} style={{ x, rotate }}>
  Custom animation
</motion.div>
```

### Chaining Animations
```tsx
<ScrollReveal direction="up">
  <ScrollScale>
    <ScrollFade>
      <div>Multiple effects combined</div>
    </ScrollFade>
  </ScrollScale>
</ScrollReveal>
```

## 📚 Resources

- [Lenis Documentation](https://github.com/studio-freight/lenis)
- [Framer Motion Scroll](https://www.framer.com/motion/scroll-animations/)
- [Rockstar Games](https://www.rockstargames.com)
- [Lenis Darkroom](https://lenis.darkroom.engineering)

## 🎊 Summary

Your portfolio now features:
- ✅ Buttery smooth scrolling (Lenis)
- ✅ Scroll-triggered animations
- ✅ Parallax effects
- ✅ Fade in/out animations
- ✅ Scale animations
- ✅ Split text reveals
- ✅ Creative showcase section
- ✅ Professional feel
- ✅ Optimized performance

**Experience the smooth!** 🚀
