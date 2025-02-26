import React, { useContext, useState } from 'react';
import './Sidebar.css';
import { assets } from '../../assets/assets';
import { Context } from '../../context/Context';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
    const [extended, setExtended] = useState(false);
    const { onSent, prevPrompts, setRecentPrompt, newChat } = useContext(Context);
    const navigate = useNavigate();
    
    const handleNavigationToGentext = () => {
        navigate("/gentext"); 
    };

    const handleNavigationToHome = () => {
        navigate("/"); 
    };

    const loadPrompt = async (prompt) => {
        setRecentPrompt(prompt);
        await onSent(prompt);
    };

    return (
        <div className='sidebar'>
            <div className="top">
                <img onClick={() => setExtended(prev => !prev)} className='menu' src={assets.menu_icon} alt="" />
                <div className="bottom">
                    <div className="pages" onClick={handleNavigationToHome}>
                        <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                        aria-hidden="true"
                        focusable="false"
                        width="18"
                        height="18"
                        >
                        <path
                            d="M448 80c8.8 0 16 7.2 16 16l0 319.8-5-6.5-136-176c-4.5-5.9-11.6-9.3-19-9.3s-14.4 3.4-19 9.3L202 340.7l-30.5-42.7C167 291.7 159.8 288 152 288s-15 3.7-19.5 10.1l-80 112L48 416.3l0-.3L48 96c0-8.8 7.2-16 16-16l384 0zM64 32C28.7 32 0 60.7 0 96L0 416c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-320c0-35.3-28.7-64-64-64L64 32zm80 192a48 48 0 1 0 0-96 48 48 0 1 0 0 96z"
                            fill="currentColor"
                        />
                        </svg>
                        {extended ? <p>Image Generator</p> : null}
                    </div>
                    <div className="pages" onClick={handleNavigationToGentext}>
                        <img src={assets.about_icon} alt="History Icon" />
                        {extended ? <p>Services</p> : null}
                    </div>
                    {/* <div className="pages">
                        <img src={assets.setting_icon} alt="" />
                        {extended ? <p>Settings</p> : null}
                    </div> */}
                </div>
                {/* <div onClick={() => newChat()} className="new-chat">
                    <img src={assets.plus_icon} alt="" />
                    {extended ? <p>New Chat</p> : null}
                </div>
                {extended
                    ? <div className="recent">
                        <p className="recent-title">Recent</p>
                        {prevPrompts.map((item, index) => {
                            return (
                                <div key={index} onClick={() => loadPrompt(item)} className="recent-entry">
                                    <img src={assets.message_icon} alt="" />
                                    <p>{item.slice(0, 18)}...</p>
                                </div>
                            )
                        })}
                    </div>
                    : null
                } */}
            </div>
        </div>
    );
}

export default Sidebar;
