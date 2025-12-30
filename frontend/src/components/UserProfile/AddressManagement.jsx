import React, { useState, useEffect } from 'react';
<<<<<<< HEAD
import { API_BASE_URL } from "../../config/api";
=======
import API_BASE_URL from '../../config/api';
>>>>>>> master
import './addressmanagement.css';

function AddressManagement() {
    const [addresses, setAddresses] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        pincode: '',
        isDefault: false
    });

    useEffect(() => {
        fetchAddresses();
    }, []);

    const fetchAddresses = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/address`, {
                credentials: 'include'
            });
            const data = await response.json();
            if (data.success) {
                setAddresses(data.addresses);
            }
        } catch (error) {
            console.error('Error fetching addresses:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const url = editingAddress
                ? `${API_BASE_URL}/address/${editingAddress.id}`
                : `${API_BASE_URL}/address`;

            const method = editingAddress ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (data.success) {
                setShowModal(false);
                resetForm();
                fetchAddresses();
            }
        } catch (error) {
            console.error('Error saving address:', error);
        }
    };

    const handleEdit = (address) => {
        setEditingAddress(address);
        setFormData({
            fullName: address.full_name,
            phone: address.phone,
            addressLine1: address.address_line1,
            addressLine2: address.address_line2 || '',
            city: address.city,
            state: address.state,
            pincode: address.pincode,
            isDefault: address.is_default
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this address?')) return;

        try {
            const response = await fetch(`${API_BASE_URL}/address/${id}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            if (response.ok) {
                fetchAddresses();
            }
        } catch (error) {
            console.error('Error deleting address:', error);
        }
    };

    const handleSetDefault = async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/address/${id}/default`, {
                method: 'PUT',
                credentials: 'include'
            });

            if (response.ok) {
                fetchAddresses();
            }
        } catch (error) {
            console.error('Error setting default:', error);
        }
    };

    const resetForm = () => {
        setFormData({
            fullName: '',
            phone: '',
            addressLine1: '',
            addressLine2: '',
            city: '',
            state: '',
            pincode: '',
            isDefault: false
        });
        setEditingAddress(null);
    };

    return (
        <div className="address-management">
            <div className="address-header">
                <h2>My Addresses</h2>
                <button onClick={() => { resetForm(); setShowModal(true); }} className="add-address-btn">
                    + Add New Address
                </button>
            </div>

            <div className="addresses-grid">
                {addresses.map((address) => (
                    <div key={address.id} className={`address-card ${address.is_default ? 'default' : ''}`}>
                        {address.is_default && <span className="default-badge">Default</span>}
                        <h3>{address.full_name}</h3>
                        <p>{address.address_line1}</p>
                        {address.address_line2 && <p>{address.address_line2}</p>}
                        <p>{address.city}, {address.state} - {address.pincode}</p>
                        <p>Phone: {address.phone}</p>

                        <div className="address-actions">
                            <button onClick={() => handleEdit(address)} className="edit-btn">Edit</button>
                            <button onClick={() => handleDelete(address.id)} className="delete-btn">Delete</button>
                            {!address.is_default && (
                                <button onClick={() => handleSetDefault(address.id)} className="default-btn">
                                    Set Default
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2>{editingAddress ? 'Edit Address' : 'Add New Address'}</h2>
                        <form onSubmit={handleSubmit}>
                            <input
                                type="text"
                                name="fullName"
                                placeholder="Full Name *"
                                value={formData.fullName}
                                onChange={handleInputChange}
                                required
                            />
                            <input
                                type="tel"
                                name="phone"
                                placeholder="Phone Number *"
                                value={formData.phone}
                                onChange={handleInputChange}
                                required
                            />
                            <input
                                type="text"
                                name="addressLine1"
                                placeholder="Address Line 1 *"
                                value={formData.addressLine1}
                                onChange={handleInputChange}
                                required
                            />
                            <input
                                type="text"
                                name="addressLine2"
                                placeholder="Address Line 2"
                                value={formData.addressLine2}
                                onChange={handleInputChange}
                            />
                            <div className="form-row">
                                <input
                                    type="text"
                                    name="city"
                                    placeholder="City *"
                                    value={formData.city}
                                    onChange={handleInputChange}
                                    required
                                />
                                <input
                                    type="text"
                                    name="state"
                                    placeholder="State *"
                                    value={formData.state}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <input
                                type="text"
                                name="pincode"
                                placeholder="Pincode *"
                                value={formData.pincode}
                                onChange={handleInputChange}
                                required
                            />
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    name="isDefault"
                                    checked={formData.isDefault}
                                    onChange={handleInputChange}
                                />
                                Set as default address
                            </label>

                            <div className="modal-actions">
                                <button type="button" onClick={() => setShowModal(false)} className="cancel-btn">
                                    Cancel
                                </button>
                                <button type="submit" className="submit-btn">
                                    {editingAddress ? 'Update' : 'Add'} Address
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AddressManagement;
