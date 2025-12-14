import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-lg-8 text-center">
                    <div className="p-5 rounded-4 shadow-lg" style={{ backgroundColor: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(10px)' }}>
                        <h1 className="display-3 fw-bold mb-4 text-dark">Your Voice Matters</h1>
                        <p className="lead mb-4 text-dark">
                            We are committed to providing the best experience possible.
                            Your feedback helps us understand what we are doing right and where we can improve.
                        </p>
                        <p className="mb-5 text-secondary">
                            Please take a moment to share your thoughts, suggestions, or report any issues you've encountered.
                        </p>
                        <Link to="/feedback" className="btn btn-dark btn-lg px-5 py-3 fw-bold rounded-pill shadow transition-hover">
                            Share Your Feedback
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
