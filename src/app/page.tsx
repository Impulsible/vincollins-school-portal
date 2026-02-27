import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Container } from '@/components/layout/container'
import Image from 'next/image'
import { 
  GraduationCap, 
  BookOpen, 
  Users, 
  Award, 
  ArrowRight, 
  Heart, 
  Shield, 
  Sparkles,
  Target,
  Star,
  CheckCircle2,
  ChevronRight,
  Quote,
  Globe,
  Trophy,
  MapPin,
  Phone,
  Mail,
  Sparkle
} from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  const sections = [
    {
      title: 'Crèche/Playgroup',
      ageRange: '0-3 years',
      count: '22',
      description: 'A nurturing environment where our youngest learners develop through play-based activities, sensory experiences, and personalized attention in a safe, caring setting.',
      icon: Heart,
      gradient: 'from-rose-400 to-pink-500',
      lightColor: 'text-rose-500',
      bgLight: 'bg-rose-50',
      borderColor: 'border-rose-200',
      image: '/images/hero-creche.jpeg',
      features: ['Safe Environment', 'Early Learning', 'Play-based', 'Sensory Play'],
    },
    {
      title: 'Nursery',
      ageRange: '3-5 years',
      count: '54',
      description: 'Building foundational skills through structured activities, creative play, and social interaction, preparing children for a seamless transition to primary education.',
      icon: Sparkles,
      gradient: 'from-amber-400 to-orange-500',
      lightColor: 'text-amber-500',
      bgLight: 'bg-amber-50',
      borderColor: 'border-amber-200',
      image: '/images/hero-nursery.jpg',
      features: ['Activities', 'Rhymes', 'Real-life Experiences', 'Social Skills'],
    },
    {
      title: 'Primary',
      ageRange: '5-11 years',
      count: '65',
      description: 'Developing critical thinking and core academic skills through a comprehensive curriculum that balances traditional subjects with modern learning approaches.',
      icon: BookOpen,
      gradient: 'from-emerald-400 to-teal-500',
      lightColor: 'text-emerald-500',
      bgLight: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      image: '/images/hero-primary.jpg',
      features: ['Core Skills', 'Critical Thinking', 'Character Building', 'STEM'],
    },
    {
      title: 'College',
      ageRange: '11-16 years',
      count: '51',
      description: 'Preparing students for future success with a challenging curriculum that develops leadership, independence, and academic excellence for higher education.',
      icon: GraduationCap,
      gradient: 'from-blue-400 to-indigo-500',
      lightColor: 'text-blue-500',
      bgLight: 'bg-blue-50',
      borderColor: 'border-blue-200',
      image: '/images/hero-college.jpeg',
      features: ['Balanced Curriculum', 'Future Ready', 'Leadership', 'Excellence'],
    },
  ]

  const coreValues = [
    { name: 'Respect', icon: Users, description: 'Treating others with dignity and consideration', color: 'text-rose-600', bgColor: 'bg-rose-100' },
    { name: 'Responsibility', icon: Shield, description: 'Taking ownership of actions and learning', color: 'text-amber-600', bgColor: 'bg-amber-100' },
    { name: 'Resilience', icon: Award, description: 'Bouncing back from challenges stronger', color: 'text-emerald-600', bgColor: 'bg-emerald-100' },
    { name: 'Aspiration', icon: Target, description: 'Dreaming big and working towards goals', color: 'text-blue-600', bgColor: 'bg-blue-100' },
    { name: 'Independence', icon: Star, description: 'Developing self-reliance and confidence', color: 'text-purple-600', bgColor: 'bg-purple-100' },
    { name: 'Kindness', icon: Heart, description: 'Showing compassion and care for others', color: 'text-pink-600', bgColor: 'bg-pink-100' },
  ]

  const stats = [
    { value: '25+', label: 'Years of Excellence', icon: Award },
    { value: '163', label: 'Students Enrolled', icon: Users },
    { value: '50+', label: 'Qualified Staff', icon: GraduationCap },
    { value: '98%', label: 'Success Rate', icon: CheckCircle2 },
  ]

  const testimonials = [
    {
      quote: "Vincollins has transformed my children's educational journey. The teachers' dedication and the nurturing environment have helped them thrive academically and personally.",
      author: "Mrs. Adebayo",
      role: "Parent of Two",
      rating: 5,
    },
    {
      quote: "The holistic development approach at Vincollins has shaped my daughter's character beautifully. She's become more confident, responsible, and eager to learn.",
      author: "Mr. Okonkwo",
      role: "Parent",
      rating: 5,
    },
    {
      quote: "I've watched my son grow from a shy boy into a confident young leader. The values instilled at Vincollins are priceless and will serve him for life.",
      author: "Dr. Eze",
      role: "Parent",
      rating: 5,
    },
  ]

  return (
    <main className="flex-1 overflow-hidden">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-amber-50">
        {/* Animated background elements */}
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
        <div className="absolute top-20 left-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-pulse animation-delay-2000" />
        
        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-primary/20 rounded-full animate-float-particle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 5}s`,
              }}
            />
          ))}
        </div>
        
        <Container className="relative py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-8 animate-fade-in-up">
              <div className="inline-flex items-center gap-3 bg-primary/10 text-primary px-5 py-2.5 rounded-full border border-primary/20 shadow-sm animate-fade-in-left">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-success"></span>
                </span>
                <span className="text-sm font-medium tracking-wide">Est. 1995 • Excellence in Education</span>
              </div>
              
              <div className="space-y-4">
                <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-[#0A2472] leading-tight animate-fade-in-right">
                  Vincollins
                  <span className="block text-secondary mt-2">Schools</span>
                </h1>
                <p className="font-script text-4xl md:text-5xl lg:text-6xl text-secondary leading-relaxed animate-float">
                  Geared Towards Success
                </p>
              </div>
              
              <p className="text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed animate-fade-in-up animation-delay-500">
                Providing a positive, safe and stimulating environment where every child can learn, 
                achieve their potential and become independent life-long learners.
              </p>
              
              {/* Single CTA Button */}
              <div className="pt-4 animate-fade-in-up animation-delay-700">
                <Button 
                  size="lg" 
                  className="group bg-[#0A2472] hover:bg-[#0A2472]/90 text-white shadow-lg hover:shadow-xl transition-all px-10 py-6 text-base font-semibold hover:scale-105"
                  asChild
                >
                  <Link href="/academics">
                    Explore Academics
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>

              {/* Trust badges - 500+ families in blue with circular animation */}
              <div className="flex items-center gap-6 pt-8 animate-fade-in-up animation-delay-900">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div 
                      key={i} 
                      className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-white shadow-lg animate-float"
                      style={{ 
                        animationDelay: `${i * 0.15}s`,
                        animationDuration: '3s'
                      }}
                    />
                  ))}
                </div>
                <p className="text-sm">
                  <span className="font-bold text-blue-600">500+</span>{' '}
                  <span className="text-muted-foreground">families trust Vincollins</span>
                </p>
              </div>
            </div>

            {/* Right Content - Hero Image with Clean Design (98% rate removed) */}
            <div className="relative animate-fade-in-right">
              <div className="relative w-full h-[600px] rounded-3xl overflow-hidden shadow-2xl group">
                <Image
                  src="/images/hero-student.jpg"
                  alt="Vincollins School Campus"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                
                {/* Achievement badge only - 98% rate removed */}
                <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm text-foreground px-5 py-2.5 rounded-full text-sm font-medium shadow-lg border border-white animate-float animation-delay-1000 hover:scale-105 transition-transform">
                  ⭐ Top Rated School 2024
                </div>

                {/* Floating sparkles */}
                <Sparkle className="absolute top-20 left-20 h-6 w-6 text-yellow-400 animate-sparkle" />
                <Sparkle className="absolute bottom-20 right-20 h-8 w-8 text-secondary animate-sparkle animation-delay-500" />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Stats Bar */}
      <section className="bg-[#0A2472] text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-white/5 rounded-full blur-3xl animate-pulse animation-delay-2000" />
        
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div 
                  key={index} 
                  className="text-center group animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="bg-white/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm group-hover:scale-110 transition-all group-hover:bg-white/20 group-hover:rotate-3">
                    <Icon className="h-8 w-8 text-secondary group-hover:animate-bounce" />
                  </div>
                  <p className="text-4xl font-bold text-white mb-2 group-hover:scale-110 transition-transform">{stat.value}</p>
                  <p className="text-sm text-white/80 uppercase tracking-wide">{stat.label}</p>
                </div>
              )
            })}
          </div>
        </Container>
      </section>

      {/* School Sections */}
      <section className="py-28 bg-gradient-to-b from-slate-50 to-white">
        <Container>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge className="mb-6 bg-primary/10 text-primary border-0 px-5 py-2 text-sm font-medium animate-fade-in-down">Our Schools</Badge>
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6 text-[#0A2472] animate-fade-in-up">
              Academic Excellence Across All Ages
            </h2>
            <p className="text-lg text-muted-foreground animate-fade-in-up animation-delay-300">
              From early years to college preparation, our comprehensive curriculum nurtures every child's unique potential.
            </p>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {sections.map((section, index) => {
              const Icon = section.icon
              return (
                <Card 
                  key={section.title}
                  className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Gradient overlay on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${section.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                  
                  {/* Image section */}
                  <div className="relative h-52 overflow-hidden">
                    <Image
                      src={section.image}
                      alt={section.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    
                    {/* Count badge */}
                    <Badge className="absolute top-4 right-4 bg-white/95 text-foreground border-0 shadow-lg px-3 py-1.5 animate-float">
                      {section.count} Students
                    </Badge>
                    
                    {/* Icon */}
                    <div className={`absolute bottom-4 left-4 ${section.bgLight} p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform`}>
                      <Icon className={`h-6 w-6 ${section.lightColor} group-hover:animate-pulse`} />
                    </div>
                  </div>
                  
                  <CardContent className="p-6">
                    <div className="mb-4">
                      <h3 className="text-2xl font-serif font-bold mb-1 group-hover:text-primary transition-colors">{section.title}</h3>
                      <p className="text-sm font-medium text-primary tracking-wide">{section.ageRange}</p>
                    </div>
                    
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                      {section.description}
                    </p>
                    
                    {/* Features */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {section.features.map((feature, i) => (
                        <span 
                          key={i} 
                          className="text-xs bg-muted/80 px-3 py-1.5 rounded-full text-muted-foreground font-medium hover:bg-primary hover:text-white transition-colors"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                    
                    <Button 
                      variant="link" 
                      className="p-0 h-auto font-semibold text-primary hover:text-primary/80 hover:no-underline group-hover:translate-x-2 transition-transform" 
                      asChild
                    >
                      <Link href={`/academics/${section.title.toLowerCase()}`}>
                        Learn more 
                        <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </Container>
      </section>

      {/* Vision & Mission */}
      <section className="py-28">
        <Container>
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Vision Card */}
            <Card className="group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-primary/5 to-transparent p-10 animate-fade-in-left">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-secondary/10 rounded-full blur-2xl animate-pulse animation-delay-1000" />
              
              <div className="relative">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-4 bg-primary/10 rounded-2xl group-hover:scale-110 transition-transform duration-300 group-hover:rotate-3">
                    <Target className="h-10 w-10 text-primary group-hover:animate-pulse" />
                  </div>
                  <h3 className="font-serif text-3xl font-bold text-[#0A2472]">Our Vision</h3>
                </div>
                
                <p className="text-xl leading-relaxed text-foreground/80 mb-10">
                  To nurture <span className="font-semibold text-primary">happy, successful children</span> by providing a positive, 
                  safe and stimulating environment where every child is valued and empowered to become an 
                  independent, life-long learner.
                </p>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-primary/5 p-5 rounded-xl hover:scale-105 transition-transform">
                    <p className="text-3xl font-bold text-primary">25+</p>
                    <p className="text-sm text-muted-foreground mt-1">Years of Excellence</p>
                  </div>
                  <div className="bg-primary/5 p-5 rounded-xl hover:scale-105 transition-transform">
                    <p className="text-3xl font-bold text-primary">100%</p>
                    <p className="text-sm text-muted-foreground mt-1">Pass Rate</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Mission Card */}
            <Card className="group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-secondary/5 to-transparent p-10 animate-fade-in-right">
              <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl animate-pulse animation-delay-1500" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl animate-pulse animation-delay-2000" />
              
              <div className="relative">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-4 bg-secondary/10 rounded-2xl group-hover:scale-110 transition-transform duration-300 group-hover:-rotate-3">
                    <Trophy className="h-10 w-10 text-secondary group-hover:animate-bounce" />
                  </div>
                  <h3 className="font-serif text-3xl font-bold text-[#0A2472]">Our Mission</h3>
                </div>
                
                <p className="font-script text-3xl text-secondary mb-6 animate-float">
                  Dream, Believe, Achieve.
                </p>
                
                <p className="text-xl leading-relaxed text-foreground/80 mb-10">
                  To provide students with <span className="font-semibold text-foreground">high-quality learning experiences</span> 
                  through a broad, balanced curriculum that prepares them for adult responsibility in the modern world.
                </p>
                
                <div className="flex items-center gap-8 text-secondary">
                  <div className="flex items-center gap-3 hover:scale-110 transition-transform">
                    <Globe className="h-6 w-6 animate-pulse" />
                    <span className="text-sm font-medium">Global</span>
                  </div>
                  <div className="flex items-center gap-3 hover:scale-110 transition-transform">
                    <BookOpen className="h-6 w-6 animate-pulse animation-delay-500" />
                    <span className="text-sm font-medium">Balanced</span>
                  </div>
                  <div className="flex items-center gap-3 hover:scale-110 transition-transform">
                    <GraduationCap className="h-6 w-6 animate-pulse animation-delay-1000" />
                    <span className="text-sm font-medium">Future Ready</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </Container>
      </section>

      {/* Core Values */}
      <section className="py-28 bg-gradient-to-b from-slate-50 to-white">
        <Container>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge className="mb-6 bg-accent/10 text-accent border-0 px-5 py-2 text-sm font-medium animate-fade-in-down">Our Foundation</Badge>
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6 text-[#0A2472] animate-fade-in-up">
              Six Core Values
            </h2>
            <p className="text-lg text-muted-foreground animate-fade-in-up animation-delay-300">
              Guiding principles that shape our community and develop character in every student.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {coreValues.map((value, index) => {
              const Icon = value.icon
              return (
                <Card 
                  key={value.name}
                  className="group relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-white text-center p-8 animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={`mb-5 mx-auto w-20 h-20 rounded-2xl ${value.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 group-hover:rotate-6`}>
                    <Icon className={`h-10 w-10 ${value.color} group-hover:animate-pulse`} />
                  </div>
                  <h3 className="font-serif font-bold text-lg mb-2 text-[#0A2472] group-hover:text-primary transition-colors">{value.name}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{value.description}</p>
                </Card>
              )
            })}
          </div>
        </Container>
      </section>

      {/* Testimonials */}
      <section className="py-28 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-[#0A2472] opacity-5" />
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-white to-transparent" />
        
        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-primary/10 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${5 + Math.random() * 5}s`,
              }}
            />
          ))}
        </div>
        
        <Container className="relative">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge className="mb-6 bg-primary/10 text-primary border-0 px-5 py-2 text-sm font-medium animate-fade-in-down">Testimonials</Badge>
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6 text-[#0A2472] animate-fade-in-up">
              What Parents Say
            </h2>
            <p className="text-lg text-muted-foreground animate-fade-in-up animation-delay-300">
              Hear from our community of parents and guardians about their experience with Vincollins Schools.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card 
                key={index}
                className="relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-white p-8 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                {/* Quote icon */}
                <Quote className="absolute top-8 right-8 h-16 w-16 text-primary/5 animate-pulse" />
                
                {/* Rating */}
                <div className="flex items-center gap-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star 
                      key={i} 
                      className="h-5 w-5 fill-yellow-400 text-yellow-400 animate-pulse" 
                      style={{ animationDelay: `${i * 0.1}s` }}
                    />
                  ))}
                </div>
                
                {/* Quote */}
                <p className="text-lg text-foreground/80 leading-relaxed mb-8 italic group-hover:text-foreground transition-colors">
                  "{testimonial.quote}"
                </p>
                
                {/* Author */}
                <div className="relative">
                  <p className="font-bold text-xl text-[#0A2472] group-hover:text-primary transition-colors">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground mt-1">{testimonial.role}</p>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden bg-[#0A2472] py-28">
        {/* Decorative elements */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse animation-delay-2000" />
        
        {/* Floating sparkles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(10)].map((_, i) => (
            <Sparkle
              key={i}
              className="absolute h-4 w-4 text-white/20 animate-sparkle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
              }}
            />
          ))}
        </div>
        
        <Container className="relative">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-8 bg-white/20 text-white border-0 px-5 py-2 text-sm font-medium hover:bg-white/30 transition-colors animate-fade-in-down">
              Join Us Today
            </Badge>
            
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-8 text-white leading-tight animate-fade-in-up">
              Join the Vincollins Community
            </h2>
            
            <p className="text-xl text-white/90 mb-12 leading-relaxed max-w-2xl mx-auto animate-fade-in-up animation-delay-300">
              Experience excellence in education. Apply now to begin your journey with Vincollins Schools.
            </p>
            
            <div className="flex flex-wrap justify-center gap-6 animate-fade-in-up animation-delay-500">
              <Button 
                size="lg" 
                className="bg-secondary text-white hover:bg-secondary/90 shadow-xl hover:shadow-2xl px-10 py-6 text-lg font-semibold transition-all hover:scale-105 group"
                asChild
              >
                <Link href="/admissions">
                  Apply Now
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              
              <Button 
                size="lg" 
                variant="outline" 
                className="bg-transparent text-white border-white hover:bg-white/10 hover:text-white px-10 py-6 text-lg font-semibold transition-all hover:scale-105"
                asChild
              >
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>

            {/* Contact Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 pt-8 border-t border-white/20 animate-fade-in-up animation-delay-700">
              <div className="flex items-center justify-center gap-3 text-white/80 hover:text-white hover:scale-105 transition-all group">
                <Phone className="h-5 w-5 text-secondary group-hover:animate-bounce" />
                <span>+234 800 123 4567</span>
              </div>
              <div className="flex items-center justify-center gap-3 text-white/80 hover:text-white hover:scale-105 transition-all group">
                <Mail className="h-5 w-5 text-secondary group-hover:animate-bounce" />
                <span>info@vincollins.edu.ng</span>
              </div>
              <div className="flex items-center justify-center gap-3 text-white/80 hover:text-white hover:scale-105 transition-all group">
                <MapPin className="h-5 w-5 text-secondary group-hover:animate-bounce" />
                <span>Lagos, Nigeria</span>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </main>
  )
}