import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/PricingPage.module.css';
import 'bootstrap/dist/css/bootstrap.css';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';

const PricingPage = () => {
  return (
    <div className={styles.pricingPage}>
      <div className={styles.container}>
        <h2 className={styles.heading}>Choose the Right Plan for You</h2>
        <p className={styles.subHeading}>Select from flexible plans designed for both freelancers and clients. Whether you're starting out or scaling your business, we've got you covered.</p>
        
        <Tabs defaultActiveKey="Freelancer" aria-label="Pricing Plans">
            <Tab eventKey="Freelancer" title="Freelancer Plans" aria-label="Freelancer Plans">
                <div className={styles.pricingSection}>
                    <h3 className={styles.heading}>Freelancer Plans</h3>
                    <div className="row">
                        {/* Freelancer Plans */}
                        <div className="col-12 col-md-4">
                            <div className={styles.pricingCard}>
                                <div className={styles.pricingCardHeader}>Free</div>
                                <div className={styles.pricingCardPrice}>$0</div>
                                <ul className={styles.featuresList}>
                                    <li>Access to basic features</li>
                                    <li>Limited job applications</li>
                                    <li>Basic portfolio management</li>
                                </ul>
                                <Link to="/signup?tab=freelancer" className={styles.ctaButton}>Start Free</Link>
                            </div>
                        </div>
                        <div className="col-12 col-md-4">
                            <div className={styles.pricingCard}>
                                <div className={styles.pricingCardHeader}>Basic</div>
                                <div className={styles.pricingCardPrice}>$19/month</div>
                                <ul className={styles.featuresList}>
                                    <li>Access to all freelancer features</li>
                                    <li>Unlimited job applications</li>
                                    <li>Priority portfolio visibility</li>
                                </ul>
                                <Link to="/signup?tab=freelancer" className={styles.ctaButton}>Get Started</Link>
                            </div>
                        </div>
                        <div className="col-12 col-md-4">
                            <div className={styles.pricingCard}>
                                <div className={styles.pricingCardHeader}>Premium</div>
                                <div className={styles.pricingCardPrice}>$49/month</div>
                                <ul className={styles.featuresList}>
                                    <li>Access to all features</li>
                                    <li>Featured profile listing</li>
                                    <li>24/7 support and coaching</li>
                                </ul>
                                <Link to="/signup?tab=freelancer" className={styles.ctaButton}>Start Premium</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </Tab>
            
            <Tab eventKey="Client" title="Client Plans" aria-label="Client Plans">
                <div className={styles.pricingSection}>
                    <h3 className={styles.heading}>Client Plans</h3>
                    <div className="row">
                        {/* Client Plans */}
                        <div className="col-12 col-md-4">
                            <div className={styles.pricingCard}>
                                <div className={styles.pricingCardHeader}>Free</div>
                                <div className={styles.pricingCardPrice}>$0</div>
                                <ul className={styles.featuresList}>
                                    <li>Post up to 3 job listings</li>
                                    <li>Access to basic candidate pool</li>
                                    <li>Email support</li>
                                </ul>
                                <Link to="/signup?tab=client" className={styles.ctaButton}>Start Free</Link>
                            </div>
                        </div>
                        <div className="col-12 col-md-4">
                            <div className={styles.pricingCard}>
                                <div className={styles.pricingCardHeader}>Basic</div>
                                <div className={styles.pricingCardPrice}>$29/month</div>
                                <ul className={styles.featuresList}>
                                    <li>Unlimited job listings</li>
                                    <li>Access to premium candidates</li>
                                    <li>Applicant screening tools</li>
                                </ul>
                                <Link to="/signup?tab=client" className={styles.ctaButton}>Get Started</Link>
                            </div>
                        </div>
                        <div className="col-12 col-md-4">
                            <div className={styles.pricingCard}>
                                <div className={styles.pricingCardHeader}>Premium</div>
                                <div className={styles.pricingCardPrice}>$79/month</div>
                                <ul className={styles.featuresList}>
                                    <li>Unlimited listings and applicants</li>
                                    <li>Dedicated account manager</li>
                                    <li>Custom branding options</li>
                                </ul>
                                <Link to="/signup?tab=client" className={styles.ctaButton}>Start Premium</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </Tab>
        </Tabs>
      </div>

      {/* FAQ Section */}
      <div className={styles.faqsSection}>
          <h3 className={styles.faqsHeading}>Frequently Asked Questions</h3>
          <div className={styles.faq}>
            <div className={styles.faqQuestion}>What happens after I sign up?</div>
            <div className={styles.faqAnswer}>After you sign up, you'll get access to the features of your chosen plan and be able to start posting jobs or applying for freelance work immediately.</div>
          </div>
          <div className={styles.faq}>
            <div className={styles.faqQuestion}>Can I change my plan later?</div>
            <div className={styles.faqAnswer}>Yes, you can upgrade or downgrade your plan at any time through your account settings.</div>
          </div>
          <div className={styles.faq}>
            <div className={styles.faqQuestion}>Do you offer a free trial?</div>
            <div className={styles.faqAnswer}>We offer a 7-day free trial for the Basic plan so you can test out the premium features before committing.</div>
          </div>
      </div>
    </div>
  );
};

export default PricingPage;
