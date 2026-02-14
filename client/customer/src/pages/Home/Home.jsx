import { useEffect, useState } from "react"
import { getHomeTrendingProducts } from "../../features/products/productService"
import ProductSection from "../../components/product/ProductSection"
import { heroSlides } from "../../data/home/heroSlides"
import Hero from "../../components/home/Hero"
import TopCategories from "../../components/home/TopCategories"
import OffersSlider from "../../components/home/OffersSlider";
import { offersData } from "../../data/home/offersData"
import RazorpayPromo from "../../components/home/RazorpayPromo";
import { paymentPromoData } from "../../data/home/paymentPromoData";
import AIRecommendations from "../../components/home/AIRecommendations";
import { aiRecommendationsData } from "../../data/home/aiRecommendationsData";
import ExploreDepartments from "../../components/home/ExploreDepartments"
import TopBrands from "../../components/home/TopBrands"
import WhySmartCart from "../../components/home/WhySmartCart"
import Testimonials from "../../components/Testimonials"
import TrustBadgeSection from "../../components/TrustBadgeSection"






const Home = () => {
  const [trending, setTrending] = useState([])

  useEffect(() => {
    const loadTrending = async () => {
      const data = await getHomeTrendingProducts()
      setTrending(data)
    }

    loadTrending()
  }, [])

  return (
    <>
      <Hero slides={heroSlides} />
      <TopCategories/>
      <ProductSection
        title="Trending Now"
        subtitle="Handpicked items loved by SmartCart users"
        products={trending}
      />
      <OffersSlider offers={offersData} />
      <RazorpayPromo data={paymentPromoData} />
      <AIRecommendations recommendations={aiRecommendationsData} />
      <ExploreDepartments/>
      <TopBrands/>
      <WhySmartCart/>
      <Testimonials/>
      <TrustBadgeSection/>



    </>
  )
}

export default Home
