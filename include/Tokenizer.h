/**
 * @file Tokenizer.h
 * @brief Defines the Tokenizer class for converting input into tokens.
 * @details This header contains the declaration for the Tokenizer class.
 * @author Dominic Saksa
 * @date 2026-09-17
 */

 //function - generate tokens from the tags
/*
    Tokens:
        Types:
            Int 
            - floater tag

            String
            - ejector tag
        
        Mathematics:
            +
            - stall tag
            
            - (subtract)
            - right hand turn tag
            - banking tag
            
            = 
            - left hand turn tag
            - banking tag

            >
            - left hand turn tag
            - no banking tag

            <
            - right hand turn tag
            - no banking tag
         
        Boolean:
            If 
            - double down tag

            For
            - double up tag

            While
            - double inversion tag
        
        Semantics:
            Endline ; 
            - acceleration tag

            (
            - ejector tag
            - banking tag
            - left hand turn tag

            )
            - ejector tag
            - banking tag
            - right hand turn tag

            {
            - 
            
            }
            -
        
        IO:
            
            Print
            - station block

            Input
            - chain lift block

        Value:
            Value start
            - stop tag

            followed by type:
                Left turn - int
                Straight - ASCII Char
                Right turn - hex

            followed by value:
                drop height - value

            value end
            - stop tag
*/

#include "Token.h"

#pragma once

class Tokenizer
{
    public:
        std::vector<Token> Tokenize(const std::vector<Element>& elements);

    private:

};