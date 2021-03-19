
const SocialButtons = () => (
    <div className="row text-center">
        <div className="col-lg-3 col-md-3 col-sm-3 col-xs-6">
            <a href="https://www.facebook.com/hsyn.arii" target="_blank" className="social-button facebook-button">
                <i className="fa fa-facebook"></i>
                <p>{/* takipçi sayısı */}</p>
            </a>
        </div>
        <div className="col-lg-3 col-md-3 col-sm-3 col-xs-6">
            <a href="https://www.instagram.com/hsynnari" target="_blank" className="social-button instagram-button">
                <i className="fa fa-instagram"></i>
                <p>{/* takipçi sayısı */}</p>
            </a>
        </div>
        <div className="col-lg-3 col-md-3 col-sm-3 col-xs-6">
            <a href="https://www.youtube.com/channel/UC4G-fAG-njYA8pA_14ocCBQ" target="_blank" className="social-button youtube-button">
                <i className="fa fa-youtube"></i>
                <p>{/* takipçi sayısı */}</p>
            </a>
        </div>
        {
            /* 
                <div className="col-lg-3 col-md-3 col-sm-3 col-xs-6">
                    <a href="#" className="social-button twitter-button">
                        <i className="fa fa-twitter"></i>
                        <p>{ takipçi sayısı }</p>
                    </a>
                </div>
            */
        }
        {
            /* 
                <div className="col-lg-3 col-md-3 col-sm-3 col-xs-6">
                    <a href="#" className="social-button google-button">
                        <i className="fa fa-google-plus"></i>
                        <p>{takipçi sayısı}</p>
                    </a>
                </div>
            */
        }
    </div>
)

export default SocialButtons;