import React, { useContext } from 'react';
import '../Gentext/Gentext.css';
import { assets } from '../../assets/assets';
import { Context } from '../../context/Context';

const Gentext = () => {
    const cardData = [
        {
            text: "Original image",
            image: assets.cardF
        },
        {
            text: "12 colors",
            image: assets.cardS
        },
        {
            text: "24 colors",
            image: assets.cardT
        },
        {
            text: "vector",
            image: assets.cardV
        }
    ];

    return (
        <div className='gentext'>
                <div className="greet">
                    <h1><span className="greet">ASG Art Therapy:</span> Color, Create, Heal</h1>
                </div>
            
            <div className="gentext-container">
                

                <section className="service-text">
                    <h1><span className="greet"> Our </span> Services </h1>
                    <p><strong>1. Image Segmentation Request</strong></p>
                    <p>Upload your image and use our platform to automatically segment it into clear, paint-by-numbers sections. The platform will process the image to create a template with distinct areas for coloring, perfect for painting.</p>

                    <p><strong>2. Send for Painting with Numbers Kit Creation</strong></p>
                    <p>Once the segmentation is done, you can send the template to us for the next step: turning it into a physical paint-by-numbers canvas. We will prepare the holst (canvas) with the necessary outlines and ready it for the next phase.</p>

                    <p><strong>3. Delivery of Ready Holst (Canvas) for Painting</strong></p>
                    <p>After the segmentation and preparation are completed, we will send the finalized, print-ready holst to you. This will include the paint-by-numbers template, ready to be painted. The canvas will come with clear boundaries and assigned color regions.</p>

                    <p><strong>4. Customized Color Palettes</strong></p>
                    <p>We’ll suggest a set of colors for your paint-by-numbers canvas based on the image. If you have specific color preferences, you can customize the palette to match your vision.</p>

                    <p><strong>5. Personalized Service for Large Orders</strong></p>
                    <p>For businesses, we offer bulk services to process multiple images and deliver several paint-by-numbers canvases. This is ideal for gift shops, therapy centers, or art studios who want to offer customized kits in volume.</p>

                    <p>The process is simple and straightforward: segment your image, send it to us, and we’ll deliver a professionally prepared painting with numbers kit, ready for you to enjoy.</p>
                    {/* <button class="order-btn">
                        Order Canva <span class="arrow"></span>
                    </button> */}

                </section>
                

                
            </div>

            <div className="cards">
                {cardData.map((card, index) => (
                    <div key={index} className="card">
                        <div className="content">
                            <p>{card.text}</p>
                            <img src={card.image} alt="icon" />
                        </div>
                    </div>

                ))}
            </div>
            <div className="gentext-bottom">
                <p className="bottom-info">
                    Create, segment, and innovate—all in one place.
                </p>
            </div>
            
        </div>
        
    );
};

export default Gentext;
