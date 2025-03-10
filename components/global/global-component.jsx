import FAQSection from "../faq-section"
import HeroSection from "../hero-section"
import ProductsList from "../product/products-list"
import ReviewSection from "../review-section"
import { RichText } from "../rich-text"
import ServiceSection from "../service-section"

export default function GlobalComponent({ data }) {
    const renderComponent = (component, index) => {
        switch (component.__component) {
            case "shared.home-hero":
                return <HeroSection key={index} {...component} />
            case "shared.service-section":
                return <ServiceSection key={index} {...component} />
            case "shared.review":
                return <ReviewSection key={index} {...component} />
            case "shared.faq-section":
                return <FAQSection key={index} {...component} />
            case "shared.products-list":
                return <ProductsList key={index} {...component} />
            case "shared.rich-text":
                return <RichText key={index} {...component} />
            default:
                return null
        }
    }

    return (
        <div className="global-component">
            {data.components.map((component, index) => renderComponent(component, index))}
        </div>
    );
}
