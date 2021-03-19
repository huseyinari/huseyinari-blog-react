// Sayfada tıklanınca en üste götüren buton
const goToTop = () => {
    window.scrollTo({top:0,behavior:'smooth'});
}
const GoToTopButton = () => (
    <div className="dmtop" onClick={goToTop}>Scroll to Top</div>
)

export default GoToTopButton;