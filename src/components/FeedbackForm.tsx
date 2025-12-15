import { useState } from 'react';
import api from '../api/api';
import type { Feedback } from '../models/Feedback';

const FeedbackForm = ({ onSuccess }: { onSuccess: () => void }) => {

    const [formData, setFormData] = useState<Feedback>({
        name: '',
        email: '',
        message: ''
    });

    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'danger', message: string } | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setStatus(null);

        try {
            await api.post('/feedback', formData);
            setFormData({ name: '', email: '', message: '' });
            setStatus({ type: 'success', message: 'Feedback submitted successfully!' });
            onSuccess();
            console.log("Feedback submitted successfully!");
            // Clear success message after 3 seconds
            setTimeout(() => setStatus(null), 3000);
        } catch (err) {
            setStatus({ type: 'danger', message: 'Failed to submit feedback. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card shadow-sm border-0" style={{ maxWidth: '600px', width: '100%' }}>
            <div className="card-header bg-white py-3">
                <h5 className="mb-0 fw-bold text-secondary">Submit Feedback</h5>
            </div>
            <div className="card-body">
                {status && (
                    <div className={`alert alert-${status.type} alert-dismissible fade show`} role="alert">
                        {status.message}
                        <button type="button" className="btn-close" onClick={() => setStatus(null)} aria-label="Close"></button>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label text-secondary small text-uppercase fw-bold">Name</label>
                        <input
                            name="name"
                            placeholder="Enter your name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="form-control shadow-none"
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label text-secondary small text-uppercase fw-bold">Email</label>
                        <input
                            name="email"
                            type="email"
                            placeholder="name@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="form-control shadow-none"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="form-label text-secondary small text-uppercase fw-bold">Message</label>
                        <textarea
                            name="message"
                            placeholder="Your feedback..."
                            rows={4}
                            value={formData.message}
                            onChange={handleChange}
                            required
                            className="form-control shadow-none"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-primary w-100 fw-bold py-2"
                    >
                        {loading ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Submitting...
                            </>
                        ) : 'Submit Feedback'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default FeedbackForm;
