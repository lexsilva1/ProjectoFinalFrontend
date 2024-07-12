import React from 'react';
import './InfoBox3.css';
import { useTranslation } from 'react-i18next';

const InfoBox3 = () => {
    const { t } = useTranslation();
    return (
        <div className="white-box">
            <div className="content-box">
                <h2>{t("Efficient Management")}</h2>
                <p>{t("Track and manage projects from start to finish in a simplified way.")}</p>
            </div>
            <div className="content-box">
                <h2>{t("Dynamic Collaboration")}</h2>
                <p>{t("Facilitate the sharing of labs and resources for continuous innovation.")}</p>
            </div>
            <div className="content-box">
                <h2>{t("Constant Innovation")}</h2>
                <p>{t("Explore innovative initiatives and boost creativity as a team.")}</p>
            </div>
        </div>
    );
};

export default InfoBox3;