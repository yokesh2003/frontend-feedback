import { useEffect, useState } from 'react';
import api from '../api/api';
import type { Feedback } from '../models/Feedback';
import Loader from './Loader';

const FeedbackTable = ({ reload }: { reload: boolean }) => {



    const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);



    // Edit State
    const [editingFeedback, setEditingFeedback] = useState<Feedback | null>(null);
    const [editForm, setEditForm] = useState<Feedback>({ name: '', email: '', message: '' });
    const [updating, setUpdating] = useState(false);

    // Delete State
    // Delete State
    const [feedbackToDelete, setFeedbackToDelete] = useState<Feedback | null>(null);
    const [deleting, setDeleting] = useState(false);

    // Toast State
    const [toast, setToast] = useState<{ show: boolean, message: string, type: 'success' | 'danger' }>({ show: false, message: '', type: 'success' });

    const showToast = (message: string, type: 'success' | 'danger' = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ ...toast, show: false }), 3000);
    };

    const loadData = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get('/feedback', {
                params: email ? { email } : {}
            });
            setFeedbacks(response.data);
        } catch (error: any) {
            console.error("Failed to load feedback", error);
            setError(error.message || 'Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [reload]);

    // Edit Handlers
    const handleEditClick = (feedback: Feedback) => {
        setEditingFeedback(feedback);
        setEditForm(feedback);
    };

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setEditForm({ ...editForm, [e.target.name]: e.target.value });
    };

    const handleUpdate = async () => {
        if (!editingFeedback?.id) return;
        setUpdating(true);
        try {
            await api.put(`/feedback/${editingFeedback.id}`, editForm);
            setEditingFeedback(null);
            showToast('Feedback updated successfully');
            loadData();
        } catch (error) {
            console.error("Failed to update feedback", error);
            showToast('Failed to update feedback', 'danger');
        } finally {
            setUpdating(false);
        }
    };

    // Delete Handlers
    const handleDeleteClick = (feedback: Feedback) => {
        setFeedbackToDelete(feedback);
    };

    const handleConfirmDelete = async () => {
        if (!feedbackToDelete?.id) return;
        setDeleting(true);
        try {
            await api.delete(`/feedback/${feedbackToDelete.id}`);
            setFeedbackToDelete(null);
            showToast('Feedback deleted successfully');
            loadData();
        } catch (error) {
            console.error("Failed to delete feedback", error);
            showToast('Failed to delete feedback', 'danger');
        } finally {
            setDeleting(false);
        }
    };

    return (
        <>
            {/* Toast Notification */}
            <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 11 }}>
                <div className={`toast align-items-center text-white bg-${toast.type} border-0 ${toast.show ? 'show' : ''}`} role="alert" aria-live="assertive" aria-atomic="true">
                    <div className="d-flex">
                        <div className="toast-body">
                            {toast.message}
                        </div>
                        <button type="button" className="btn-close btn-close-white me-2 m-auto" onClick={() => setToast({ ...toast, show: false })} aria-label="Close"></button>
                    </div>
                </div>
            </div>

            <div className="card shadow-sm border-0">
                <div className="card-header bg-white py-3">
                    <div className="d-flex justify-content-between align-items-center">
                        <h5 className="mb-0 fw-bold text-secondary">Feedback List</h5>
                        <span className="badge rounded-pill bg-primary">{feedbacks.length} Records</span>
                    </div>
                </div>
                <div className="card-body p-0">
                    <div className="p-3 bg-light border-bottom">
                        <div className="input-group">
                            <span className="input-group-text bg-white border-end-0">
                                🔍
                            </span>
                            <input
                                type="text"
                                className="form-control border-start-0 shadow-none"
                                placeholder="Search by email..."
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onBlur={loadData}
                                onKeyDown={(e) => e.key === 'Enter' && loadData()}
                            />
                        </div>
                    </div>

                    {loading ? (
                        <div className="p-5">
                            <Loader />
                        </div>
                    ) : error ? (
                        <div className="text-center p-5 text-danger">
                            <p className="mb-0">{error}</p>
                            <p className="small text-muted mt-2">Check console for more details.</p>
                        </div>
                    ) : feedbacks.length === 0 ? (
                        <div className="text-center p-5 text-muted">
                            <p className="mb-0">No feedback found.</p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover mb-0 align-middle">
                                <thead className="bg-light">
                                    <tr>
                                        <th className="ps-4 border-0 text-secondary text-uppercase small">Name</th>
                                        <th className="border-0 text-secondary text-uppercase small">Email</th>
                                        <th className="border-0 text-secondary text-uppercase small">Message</th>
                                        <th className="border-0 text-secondary text-uppercase small">Date</th>
                                        <th className="border-0 text-secondary text-uppercase small text-end pe-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {feedbacks.map(f => (
                                        <tr key={f.id}>
                                            <td className="ps-4 fw-medium">{f.name}</td>
                                            <td>{f.email}</td>
                                            <td className="text-muted text-truncate" style={{ maxWidth: '200px' }}>{f.message}</td>
                                            <td className="text-muted small">
                                                {new Date(f.createdAt!).toLocaleDateString()}
                                            </td>
                                            <td className="text-end pe-4">
                                                <button
                                                    className="btn btn-sm btn-outline-primary me-2"
                                                    onClick={() => handleEditClick(f)}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-outline-danger"
                                                    onClick={() => handleDeleteClick(f)}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Edit Modal */}
            {editingFeedback && (
                <div className="modal fade show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Edit Feedback</h5>
                                <button type="button" className="btn-close" onClick={() => setEditingFeedback(null)}></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label className="form-label">Name</label>
                                    <input
                                        name="name"
                                        className="form-control"
                                        value={editForm.name}
                                        onChange={handleEditChange}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Email</label>
                                    <input
                                        name="email"
                                        className="form-control"
                                        value={editForm.email}
                                        onChange={handleEditChange}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Message</label>
                                    <textarea
                                        name="message"
                                        className="form-control"
                                        rows={3}
                                        value={editForm.message}
                                        onChange={handleEditChange}
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setEditingFeedback(null)}>Cancel</button>
                                <button type="button" className="btn btn-primary" onClick={handleUpdate} disabled={updating}>
                                    {updating ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {feedbackToDelete && (
                <div className="modal fade show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Confirm Delete</h5>
                                <button type="button" className="btn-close" onClick={() => setFeedbackToDelete(null)}></button>
                            </div>
                            <div className="modal-body">
                                <p>Are you sure you want to delete the feedback from <strong>{feedbackToDelete.name}</strong>?</p>
                                <p className="text-muted small mb-0">This action cannot be undone.</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setFeedbackToDelete(null)}>Cancel</button>
                                <button type="button" className="btn btn-danger" onClick={handleConfirmDelete} disabled={deleting}>
                                    {deleting ? 'Deleting...' : 'Delete'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default FeedbackTable;
