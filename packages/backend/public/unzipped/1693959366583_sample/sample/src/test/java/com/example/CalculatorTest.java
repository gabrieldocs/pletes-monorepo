package com.example;

import static org.junit.Assert.assertEquals;
import org.junit.Before;
import org.junit.Test;
import static org.junit.Assert.assertThrows;

public class CalculatorTest {

    private Calculator calculator;

    @Before
    public void setUp() {
        calculator = new Calculator();
    }

    @Test 
    public void test0001() {
        assertEquals(4, calculator.sum(2, 2));
        assertEquals(10, calculator.sum(5, 5));
    }

    @Test 
    public void testDiv3() {
        assertEquals(3, calculator.div(12, 4));
        assertEquals(10, calculator.div(100, 10));
    }

    
    @Test 
    public void testDiv4() {
        assertEquals(3, calculator.div(6, 2));
        assertEquals(10, calculator.div(100, 10));
    }
    
    @Test 
    public void test0002() {
        assertEquals(4, calculator.sum(2, 2));
        assertEquals(10, calculator.sum(5, 5));
    }

    @Test 
    public void test0003() {
        assertEquals(4, calculator.sum(2, 2));
        assertEquals(10, calculator.sum(5, 5));
    }

    @Test 
    public void test0004 () {
        assertEquals(4, calculator.sum(2, 2));
        assertEquals(10, calculator.sum(5, 5));
    }

    @Test 
    public void test0005 () {
        assertEquals(4, calculator.sum(2, 2));
        assertEquals(10, calculator.sum(5, 5));
    }

    @Test
    public void testSum2() {
        assertEquals(4, calculator.sum(2, 2));
        assertEquals(10, calculator.sum(5, 5));
        // Add more test cases for the sum method as needed
    }

    @Test
    public void testSum3() {
        assertEquals(4, calculator.sum(2, 2));
        assertEquals(10, calculator.sum(5, 5));
        // Add more test cases for the sum method as needed
    }

    @Test
    public void testSum4() {
        assertEquals(4, calculator.sum(2, 2));
        assertEquals(10, calculator.sum(5, 5));
        // Add more test cases for the sum method as needed
    }

    @Test
    public void testSum() {
        assertEquals(4, calculator.sum(2, 2));
        assertEquals(10, calculator.sum(5, 5));
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

    @Test
    public void testDiv2() {
        // Basic division tests
        assertEquals(1, calculator.div(2, 2));
        assertEquals(2, calculator.div(10, 5));

        // Division by zero should throw an ArithmeticException
        assertThrows(ArithmeticException.class, () -> calculator.div(5, 0));

        // Division of a negative number by a positive number
        assertEquals(-2, calculator.div(-10, 5));

        // Division of a negative number by a negative number
        assertEquals(2, calculator.div(-10, -5));

        // Division of a large number by a small number
        assertEquals(1000, calculator.div(10000, 10));

        // Division of zero by a non-zero number should result in zero
        assertEquals(0, calculator.div(0, 10));

        // Division of zero by zero should throw an ArithmeticException
        assertThrows(ArithmeticException.class, () -> calculator.div(0, 0));

        // Large numbers division
        assertEquals(1000000, calculator.div(10000000, 10));
    }
}