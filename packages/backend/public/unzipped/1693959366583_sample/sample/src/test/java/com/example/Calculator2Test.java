package com.example;

import static org.junit.Assert.assertEquals;
import org.junit.Before;
import org.junit.Test;

public class Calculator2Test {

    private Calculator calculator;

    @Before
    public void setUp() {
        calculator = new Calculator();
    }

    @Test
    public void testSum() {
        assertEquals(5, calculator.sum(3, 2));
        assertEquals(2, calculator.sum(1, 1));
        // Add more test cases for the sum method as needed
    }

    @Test
    public void testSub() {
        assertEquals(0, calculator.sub(2, 2));
        assertEquals(3, calculator.sub(5, 2));
        // Add more test cases for the sub method as needed
    }

    @Test
    public void testMux() {
        assertEquals(4, calculator.mux(2, 2));
        assertEquals(15, calculator.mux(3, 5));
        // Add more test cases for the mux method as needed
    }

    @Test
    public void testDiv() {
        assertEquals(1, calculator.div(2, 2));
        assertEquals(2, calculator.div(10, 5));
        // Add more test cases for the div method as needed
    }
}
