//src/app/contact/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  MessageCircle, 
  HeadphonesIcon,
  ShoppingCart,
  HelpCircle
} from "lucide-react";

const ContactPage = () => {
  // Contact information
  const contactInfo = [
    {
      icon: <MapPin className="h-6 w-6" />,
      title: "Visit Our Store",
      details: [
        "123 Commerce Street",
        "Shopping District, NY 10001",
        "United States"
      ]
    },
    {
      icon: <Phone className="h-6 w-6" />,
      title: "Call Us",
      details: [
        "+1 (555) 123-4567",
        "+1 (555) 987-6543",
        "Mon-Fri: 9 AM - 8 PM EST"
      ]
    },
    {
      icon: <Mail className="h-6 w-6" />,
      title: "Email Us",
      details: [
        "support@myapp.com",
        "sales@myapp.com",
        "info@myapp.com"
      ]
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Business Hours",
      details: [
        "Monday - Friday: 9 AM - 8 PM",
        "Saturday: 10 AM - 6 PM", 
        "Sunday: 12 PM - 5 PM"
      ]
    }
  ];

  // Support departments
  const supportDepartments = [
    {
      icon: <ShoppingCart className="h-5 w-5" />,
      title: "Order Support",
      description: "Help with orders, shipping, and returns",
      email: "orders@myapp.com"
    },
    {
      icon: <HeadphonesIcon className="h-5 w-5" />,
      title: "Technical Support", 
      description: "Website issues and technical assistance",
      email: "tech@myapp.com"
    },
    {
      icon: <MessageCircle className="h-5 w-5" />,
      title: "General Inquiries",
      description: "Product questions and general information",
      email: "info@myapp.com"
    }
  ];

  return (
    <main className="min-h-screen py-16 md:py-20 px-4 bg-background">
      <div className="container mx-auto max-w-6xl">
        
        {/* Page Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <MessageCircle className="h-4 w-4" />
            Get In Touch
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Contact Us
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Have questions? We're here to help! Reach out to our friendly team 
            for support, inquiries, or just to say hello.
          </p>
        </div>

        {/* Contact Form & Info Grid */}
        <div className="grid lg:grid-cols-2 gap-12 md:gap-16 mb-16">
          
          {/* Contact Form */}
          <Card className="border border-border bg-card">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-foreground">
                Send us a Message
              </CardTitle>
              <p className="text-muted-foreground">
                Fill out the form below and we'll get back to you within 24 hours.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    First Name
                  </label>
                  <Input 
                    placeholder="John"
                    className="border-border"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Last Name
                  </label>
                  <Input 
                    placeholder="Doe"
                    className="border-border"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Email Address
                </label>
                <Input 
                  type="email"
                  placeholder="john@example.com"
                  className="border-border"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Subject
                </label>
                <Input 
                  placeholder="How can we help you?"
                  className="border-border"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Message
                </label>
                <Textarea 
                  placeholder="Tell us more about your inquiry..."
                  className="border-border min-h-[120px]"
                />
              </div>
              
              <Button className="w-full">
                <Mail className="h-4 w-4 mr-2" />
                Send Message
              </Button>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Get in Touch
            </h2>
            
            <div className="grid gap-6">
              {contactInfo.map((info, index) => (
                <Card key={index} className="border border-border bg-card">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="p-3 rounded-lg bg-primary/10 text-primary">
                        {info.icon}
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-semibold text-foreground">
                          {info.title}
                        </h3>
                        {info.details.map((detail, idx) => (
                          <p key={idx} className="text-sm text-muted-foreground">
                            {detail}
                          </p>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Support Departments */}
        <div className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-12">
            How Can We Help?
          </h2>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {supportDepartments.map((dept, index) => (
              <Card key={index} className="border border-border bg-card hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 rounded-full bg-primary/10 text-primary">
                      {dept.icon}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-foreground">
                      {dept.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {dept.description}
                    </p>
                    <div className="pt-2">
                      <a 
                        href={`mailto:${dept.email}`}
                        className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
                      >
                        {dept.email}
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <Card className="border border-border bg-card">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-full bg-primary/10 text-primary">
                <HelpCircle className="h-6 w-6" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-foreground">
              Frequently Asked Questions
            </CardTitle>
            <p className="text-muted-foreground">
              Quick answers to common questions
            </p>
          </CardHeader>
          <CardContent className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-foreground mb-2">
                  What are your shipping options?
                </h4>
                <p className="text-sm text-muted-foreground">
                  We offer free standard shipping on orders over $50, with express 
                  delivery options available for faster service.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">
                  How can I track my order?
                </h4>
                <p className="text-sm text-muted-foreground">
                  Once your order ships, you'll receive a tracking number via email 
                  to monitor your package's progress.
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-foreground mb-2">
                  What is your return policy?
                </h4>
                <p className="text-sm text-muted-foreground">
                  We offer a 30-day return policy for most items. Products must be 
                  in original condition with packaging.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">
                  Do you offer customer support?
                </h4>
                <p className="text-sm text-muted-foreground">
                  Yes! Our customer support team is available Monday-Friday, 
                  9 AM - 8 PM EST to assist you.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default ContactPage; 