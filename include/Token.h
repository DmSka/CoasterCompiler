/**
 * @file Token.h
 * @brief Defines the Token structure and TokenType enumeration.
 * @details This header contains the definition for tokens used in the parser.
 * @author Dominic Saksa
 * @date 2026-09-17
 */

#include <string>

enum class TokenType
{
    Integer,
    String,

    Plus,
    Minus,
    Equals,

    If,
    For,
    While,

    Endline,

    Print,
    Input,

    ValueStart,
    ValueEnd,

    Identifier
};


struct Token
{
    TokenType type;
    std::string value;

    double numericValue = 0.0;
};
