import products from './pages/products';
import services from './pages/services';
import academy from './pages/academy';
import careers from './pages/careers';
import contact from './pages/contact';
import insights from './pages/insights';
import productDetail from './pages/product-detail';
import insightDetail from './pages/insight-detail';
import Home from './pages/Home';
import About from './pages/About';
import __Layout from './Layout.jsx';


export const PAGES = {
    "products": products,
    "services": services,
    "academy": academy,
    "careers": careers,
    "contact": contact,
    "insights": insights,
    "product-detail": productDetail,
    "insight-detail": insightDetail,
    "Home": Home,
    "About": About,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};