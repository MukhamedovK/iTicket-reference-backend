const express = require("express");
const mongoose = require('mongoose');
const Seat = require('../models/SeatModel');
const router = express.Router();

/**
 * @swagger
 * /api/v1/seats:
 *   get:
 *     summary: Get all seats
 *     description: Retrieve a list of all seats with optional filtering.
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter by seat status (e.g., free, reserved)
 *       - in: query
 *         name: sector
 *         schema:
 *           type: number
 *         description: Filter by sector number
 *     responses:
 *       200:
 *         description: List of seats
 */
router.get('/seats', async (req, res) => {
    try {
        const filters = {};
        if (req.query.status) filters.status = req.query.status;
        if (req.query.sector) filters.sector = req.query.sector;
        
        const seats = await Seat.find(filters);
        res.json(seats);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

/**
 * @swagger
 * /api/v1/seats/{id}:
 *   get:
 *     summary: Get seat by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Seat ID
 *     responses:
 *       200:
 *         description: Seat details
 *       404:
 *         description: Seat not found
 */
router.get('/seats/:id', async (req, res) => {
    try {
        const seat = await Seat.findById(req.params.id);
        if (!seat) return res.status(404).json({ message: 'Seat not found' });
        res.json(seat);
    } catch (error) {
        res.status(400).json({ message: 'Invalid ID format', error });
    }
});

/**
 * @swagger
 * /api/v1/seats:
 *   post:
 *     summary: Create a new seat
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               row:
 *                 type: number
 *               seat:
 *                 type: number
 *               sector:
 *                 type: string
 *               seat_type:
 *                 type: string
 *               map_type:
 *                 type: string
 *               price:
 *                 type: number
 *               color:
 *                 type: string
 *               category:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created seat
 */
router.post('/seats', async (req, res) => {
    try {
        const { row, seat, sector, seat_type, map_type, price, color, category } = req.body;
        const newSeat = new Seat({ row, seat, seat_type, sector, map_type, category, price, color, status: 'free' });
        await newSeat.save();
        res.status(201).json(newSeat);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

/**
 * @swagger
 * /api/v1/seats/{id}:
 *   put:
 *     summary: Update seat details
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Updated seat
 */
router.put('/seats/:id', async (req, res) => {
    try {
        const updatedSeat = await Seat.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedSeat) return res.status(404).json({ message: 'Seat not found' });
        res.json(updatedSeat);
    } catch (error) {
        res.status(400).json({ message: 'Invalid ID format or update error', error });
    }
});

/**
 * @swagger
 * /api/v1/seats/{id}:
 *   delete:
 *     summary: Delete a seat
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Seat deleted
 */
router.delete('/seats/:id', async (req, res) => {
    try {
        const seat = await Seat.findByIdAndDelete(req.params.id);
        if (!seat) return res.status(404).json({ message: 'Seat not found' });
        res.json({ message: 'Seat deleted' });
    } catch (error) {
        res.status(400).json({ message: 'Invalid ID format', error });
    }
});

/**
 * @swagger
 * /api/v1/seats/{id}/reserve:
 *   patch:
 *     summary: Reserve a seat
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Seat reserved
 */
router.patch('/seats/:id/reserve', async (req, res) => {
    try {
        const seat = await Seat.findById(req.params.id);
        if (!seat) return res.status(404).json({ message: 'Seat not found' });
        if (seat.status !== 'free') return res.status(400).json({ message: 'Seat not available' });

        seat.status = 'reserved';
        seat.booking_time = new Date();
        seat.expiration_time = new Date(Date.now() + 15 * 60 * 1000); // 15 min hold
        await seat.save();
        res.json(seat);
    } catch (error) {
        res.status(400).json({ message: 'Invalid ID format', error });
    }
});

module.exports = router;



