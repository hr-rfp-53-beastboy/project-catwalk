import React, { useState, useEffect, useContext } from 'react';
import RelatedCard from './relatedCard';
import request from '../../requests';
import ProductContext from '../../contexts/ProductContext';
import relatedSamples from './relatedSamples'; // delete later
import stylesSamples from './stylesSamples'; // delete later

// eslint-disable-next-line func-names
const RelatedList = function () {
  const product = useContext(ProductContext);
  const numberOfCards = relatedSamples.length;
  const [relatedlist, setRelatedlist] = useState([]);
  const [index, setIndex] = useState(1);
  const [translateX, setTranslateX] = useState(0);

  useEffect(() => {
    request.get(`products/${product.id}/related`, { endpoint: `products/${product.id}/related` })
    // request.get(`reviews/meta`, { endpoint: `reviews/meta`, product_id: product.id })
    // request.get(`products/${product.id}/styles`, { endpoint: `products/${product.id}/styles` })
      .then((relatedProducts) => {
        console.log('Successfully retrieved related:', relatedProducts.data);
        // console.log('Successfully retrieved related:', relatedProducts.data.ratings);
        // console.log('Successfully retrieved related:', relatedProducts.data.results[0].photos[0].thumbnail_url);
        //fetch data for each related product
        //fetch data for each related product thumbnail images
        //fetch data for each related product star rating
      }).catch((err) => {
        console.log(err);
      });
  }, [product.id]);

  function buttonHandle(event) {
    const response = event.target.id;

    if (response === 'relatedPrevious') {
      if (index !== 1) {
        setIndex((previousIndex) => previousIndex - 1);
        setTranslateX((previousTranslateX) => previousTranslateX + 270);
      }
    } else if (response === 'relatedNext') {
      if (index !== numberOfCards) {
        setIndex((previousIndex) => previousIndex + 1);
        setTranslateX((previousTranslateX) => previousTranslateX - 270);
      }
    }
  }

  useEffect(() => {
    let initial = 0;
    const cards = document.getElementsByClassName('relatedCard');
    for (initial; initial < cards.length; initial += 1) {
      cards[initial].style.transform = `translateX(${translateX}px`;
    }
  }, [index, translateX]);

  return (
    <div id="related" >
      <button type="button" className="carousel_button previous" id="relatedPrevious" onClick={buttonHandle}>&#60;</button>
      <div className="carousel" id="relatedList">
        {relatedSamples.map((relatedProduct, index) => <RelatedCard product={relatedProduct} thumbnail={stylesSamples[index].photos[0].thumbnail_url} key={relatedProduct.id} />)}
      </div>
      <button type="button" className="carousel_button next" id="relatedNext" onClick={buttonHandle}>&#62;</button>
    </div>
  );
};

export default RelatedList;
