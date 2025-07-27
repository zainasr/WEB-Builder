//src/components/HomePage/about-us.tsx
import { Card, CardContent } from "@/components/ui/card";

import { 
  ShoppingBag, 
  Shield, 
  Truck, 
  Headphones, 
  Award, 
  Users, 
  Clock,
  CheckCircle
} from "lucide-react";

const AboutUs = () => {
  // Company stats
  const stats = [
    {
      icon: <Users className="h-8 w-8" />,
      number: "50K+",
      label: "Happy Customers",
    },
    {
      icon: <ShoppingBag className="h-8 w-8" />,
      number: "100K+",
      label: "Products Delivered",
    },
    {
      icon: <Award className="h-8 w-8" />,
      number: "5 Years",
      label: "In Business",
    },
    {
      icon: <CheckCircle className="h-8 w-8" />,
      number: "99.5%",
      label: "Customer Satisfaction",
    },
  ];

  // Key features
  const features = [
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Secure Shopping",
      description: "Your data and payments are protected with industry-leading security measures.",
    },
    {
      icon: <Truck className="h-6 w-6" />,
      title: "Fast Delivery",
      description: "Free shipping on orders over $50 with express delivery options available.",
    },
    {
      icon: <Headphones className="h-6 w-6" />,
      title: "24/7 Support",
      description: "Our dedicated customer service team is here to help you anytime, anywhere.",
    },
    {
      icon: <Award className="h-6 w-6" />,
      title: "Quality Guarantee",
      description: "30-day money-back guarantee on all products. Quality you can trust.",
    },
  ];

  return (
    <section className="py-16 md:py-20 px-4 bg-background">
      <div className="container mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <ShoppingBag className="h-4 w-4" />
            Our Story
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            About Our Store
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Founded with a passion for quality and customer satisfaction, we've been serving 
            customers worldwide with carefully curated products and exceptional service.
          </p>
        </div>

        {/* Company Story */}
        <div className="grid lg:grid-cols-2 gap-12 md:gap-16 mb-16">
          <div className="space-y-6">
            <h3 className="text-2xl md:text-3xl font-bold text-foreground">
              Our Mission
            </h3>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              We believe shopping should be simple, secure, and enjoyable. That's why we've 
              built a platform that combines the latest technology with a personal touch, 
              ensuring every customer finds exactly what they're looking for.
            </p>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              From electronics to fashion, home goods to fitness equipment, we carefully 
              select every product in our catalog to meet our high standards of quality 
              and value.
            </p>
          </div>

          <div className="space-y-6">
            <h3 className="text-2xl md:text-3xl font-bold text-foreground">
              Why Choose Us?
            </h3>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              With years of experience in e-commerce, we understand what customers want: 
              quality products, competitive prices, fast shipping, and reliable customer service.
            </p>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              Our team works tirelessly to ensure your shopping experience exceeds expectations, 
              from the moment you browse our catalog to long after your purchase arrives.
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-16">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center border border-border bg-card">
              <CardContent className="p-6">
                <div className="flex justify-center mb-4">
                  <div className="p-3 rounded-full bg-primary/10 text-primary">
                    {stat.icon}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl md:text-3xl font-bold text-foreground">
                    {stat.number}
                  </div>
                  <div className="text-sm md:text-base text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features Grid */}
        <div>
          <h3 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-12">
            What Makes Us Different
          </h3>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center border border-border bg-card hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 rounded-full bg-primary/10 text-primary">
                      {feature.icon}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h4 className="text-lg font-semibold text-foreground">
                      {feature.title}
                    </h4>
                    <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-2 text-primary font-medium text-lg">
            <Clock className="h-5 w-5" />
            Join thousands of satisfied customers today
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs; 