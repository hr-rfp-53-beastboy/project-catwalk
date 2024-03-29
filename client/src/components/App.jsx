/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect, lazy, Suspense } from 'react';
const OverviewContainer = React.lazy(() => import('./Overview/widget'));
const RelatedContainer = React.lazy(() => import('./RelatedWidget/widget'));
const QaContainer = React.lazy(() => import('./QAWidget/widget'));
const ReviewsContainer = React.lazy(() => import('./ReviewsWidget/widget'));
const Browse = React.lazy(() => import('./Browse/BrowsePage'));
import QALoadContext from '../contexts/QALoadContext';
import RatingContext from '../contexts/RatingContext';
import ReviewContext from '../contexts/ReviewContext';
import ModalOff from '../contexts/ModalOffContext';
import ProductContext from '../contexts/ProductContext';
import ProductIdContext from '../contexts/ProductIdContext';
import ThemeContext from '../contexts/ThemeContext';
import logo from './logo';
import request from '../requests';
import '../style.sass';

const App = () => {
  const [browse, setBrowse] = useState(false);
  const [currentProductId, setCurrentProductId] = useState(17074);
  const [theme, setTheme] = useState('light');
  const [currentProductData, setCurrentProductData] = useState(null);
  const [idInput, setIdInput] = useState('');
  const [averageRating, setAverageRating] = useState(null);
  const [allReviews, setAllReviews] = useState([]);
  const [modalOff, setModalOff] = useState(false);

  const spy = (event, widget) => {
    const { target } = event;
    const element = target.nodeName.toLowerCase();
    const time = Date.now().toString();

    request.post('interactions/', {
      element, widget, time,
    })
      .catch(console.error);
  };

  useEffect(() => {
    setBrowse(false);
    request.get(`products/${currentProductId}`, {
      product_id: currentProductId,
    }).then((res) => {
      setCurrentProductData(res.data);
    }).catch((err) => {
      console.error(err);
      alert('The product couldn\'t load');
    });
  }, [currentProductId]);
  useEffect(() => {
    const app = document.getElementById('app');
    app.className = theme;
  }, [theme]);
  if (!browse && currentProductData) {
    return (
      <ThemeContext.Provider value={theme}>
        <main>
          <div id="nav">
            <img x="6" y="2" width="108" height="90" src={logo} alt="Project Catwalk logo" />
            <input
              type="text"
              placeholder="17067 -- 18077"
              value={idInput}
              onChange={(e) => {
                setIdInput(e.target.value);
              }}
            />
            <button
              value="search"
              type="button"
              id="changeId"
              aria-label="Search for another product (17067 - 18077)"
              onClick={() => {
                if (Number(idInput) >= 17067 && Number(idInput) <= 18077) {
                  setCurrentProductId(idInput);
                } else {
                  setIdInput('Not Valid');
                }
              }}
            >
              <i className="fa fa-search" aria-hidden="true" />
            </button>
            <button
              value="Browse"
              type="button"
              id="browse"
              onClick={() => {
                setBrowse(true);
              }}
            >
              Browse Products
            </button>
            <select id="themeSelect" onChange={(e) => setTheme(e.target.value)}>
              <option value="light" defaultValue={theme === 'light'}>Light Mode</option>
              <option value="dark" defaultValue={theme === 'dark'}>Dark Mode</option>
              <option value="beast-boy" defaultValue={theme === 'beast-boy'}>Beast Boy</option>
            </select>
          </div>
          <p id="announcement">
            <i>SITE-WIDE ANNOUNCEMENT MESSAGE!</i>
            <span> — SALE/DISCOUNT </span>
            <b>OFFER</b>
            <span> — </span>
            <u>NEW PRODUCT HIGHLIGHT</u>
          </p>
          <ModalOff.Provider value={{ modalOff, setModalOff }}>
            <ProductContext.Provider value={currentProductData}>
              <ReviewContext.Provider value={[allReviews, setAllReviews]}>
                <RatingContext.Provider value={[averageRating, setAverageRating]}>
                  <Suspense fallback={<div>Loading...</div>}>
                    <OverviewContainer spy={spy} />
                  </Suspense>
                </RatingContext.Provider>
              </ReviewContext.Provider>
              <ProductIdContext.Provider value={[currentProductId, setCurrentProductId]}>
                <Suspense fallback={<div>Loading...</div>}>
                  <RelatedContainer spy={spy} />
                </Suspense>
              </ProductIdContext.Provider>
              <QALoadContext.Provider value={() => {}}>
                <Suspense fallback={<div>Loading...</div>}>
                  <QaContainer spy={spy} />
                </Suspense>
              </QALoadContext.Provider>
              <ReviewContext.Provider value={[allReviews, setAllReviews]}>
                <RatingContext.Provider value={[averageRating, setAverageRating]}>
                  <Suspense fallback={<div>Loading...</div>}>
                    <ReviewsContainer spy={spy} />
                  </Suspense>
                </RatingContext.Provider>
              </ReviewContext.Provider>
            </ProductContext.Provider>
          </ModalOff.Provider>
        </main>
      </ThemeContext.Provider>
    );
  } else if (!currentProductData) {
    return null;
  }
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Browse setProduct={setCurrentProductId} />
    </Suspense>
  );
};

export default App;
