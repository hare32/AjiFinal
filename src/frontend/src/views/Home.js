import React, { useState, useEffect } from 'react';
import ProductTable from '../components/ProductTable';
import { Modal, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [cartItems, setCartItems] = useState(JSON.parse(localStorage.getItem('cartItems')) || []);
    const [showModal, setShowModal] = useState(false);
    const [lastAddedItem, setLastAddedItem] = useState(null);

    useEffect(() => {
        fetch('http://localhost:3000/products')
            .then(response => response.json())
            .then(data => setProducts(data));
    }, []);

    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    const handleAddToCart = (product) => {
        let updatedCartItems = [];
        const existingItem = cartItems.find(item => item.id === product.id);
        if (existingItem) {
            updatedCartItems = cartItems.map(item =>
                item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
            );
        } else {
            const newCartItem = { ...product, quantity: 1 };
            updatedCartItems = [...cartItems, newCartItem];
        }

        setCartItems(updatedCartItems);
        setLastAddedItem(product);
        setShowModal(true);
    };


    const handleCloseModal = () => setShowModal(false);

    return (
        <div>
            <ProductTable products={products} onAddToCart={handleAddToCart} />
            <Link to={{ pathname: "/checkout", state: { cartItems: cartItems } }}>Przejdź do koszyka</Link>
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Produkt dodany do koszyka</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {lastAddedItem && <p>Dodałeś {lastAddedItem.name} do koszyka!</p>}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Zamknij
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default Home;
