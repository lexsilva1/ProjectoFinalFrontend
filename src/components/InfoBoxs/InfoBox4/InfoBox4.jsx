import React from 'react';
import './InfoBox4.css';
import { useTranslation } from 'react-i18next';

const InfoBox4 = () => {
    const { t } = useTranslation();
    return (
        <div className="white-box4">
            <div className="content-box-info4">
                <h2 className="nowrap title-info4">{t("Check out our latest projects")}</h2>
            </div>
        </div>
    );
};

export default InfoBox4;