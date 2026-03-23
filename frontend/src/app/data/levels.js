export const levelsData = {
    level3: {
        cyber: {
            title: "LEVEL 3 — ENCRYPTION MAZE",
            context: "OBLIVION ne main network packets ko bitwise cipher se encrypt kar diya hai. Decryption protocol me ek critical operation missing hai.",
            problem: "Humne ek locked transmission intercept kiya hai. Packet header ko unlock karne ke liye ek specific XOR operation chahiye jo decryption key ke saath apply hoga. C++ logic complete karo.",
            code: `#include <iostream>\nusing namespace std;\n\nint main() {\n    char packet_header = 'X'; \n    char decryption_key = 5;\n    \n    // XOR logic use karke packet header decrypt karo\n    char decrypted = ___;\n    \n    cout << "Decoded payload: " << decrypted;\n    return 0;\n}`,
            tasks: [
                "C++ decryption module ko dhyaan se analyze karo.",
                "Sahi bitwise operator identify karo jo symmetric encryption me use hota hai.",
                "Decryption protocol execute karo."
            ],
            clues: [
                "Symmetric encryption me ek aisa operator use hota hai jo khud ko reverse kar sakta hai.",
                "Yeh arithmetic nahi, bitwise operation hai.",
                "Us operator ko dhundo jiska matlab hota hai 'Exclusive OR'."
            ],
            successMessage: "PACKET DECRYPTED — PAYLOAD ACCESS MIL GAYA",
            failureHint: "Galat operation. Yeh operator cipher ko reverse nahi kar raha.",
            answer: "packet_header ^ decryption_key",
            options: [
                "packet_header & decryption_key",
                "packet_header ^ decryption_key",
                "packet_header | decryption_key",
                "packet_header + decryption_key"
            ]
        },

        dev: {
            title: "LEVEL 3 — THE CORRUPTED OFFSET",
            context: "OBLIVION ne data core breach kar diya hai aur primary shifting algorithm corrupt ho gaya hai. System ab random aur garbled text generate kar raha hai.",
            problem: "Central database ek basic Caesar cipher use karta hai, lekin decryption offset toot gaya hai. Sahi mathematical logic restore karke data ko decrypt karo.",
            code: `#include <iostream>\nusing namespace std;\n\nchar decryptChar(char encryptedChar, int shiftOffset) {\n    // Caesar cipher ko reverse karo\n    return ___;\n}\n\nint main() {\n    // 'D' ko wapas 'A' me convert karna hai\n    cout << decryptChar('D', 3); \n    return 0;\n}`,
            tasks: [
                "Caesar cipher ke decryption logic ko samjho.",
                "Sahi mathematical operation identify karo.",
                "Original character offset restore karo."
            ],
            clues: [
                "Agar encryption me characters aage shift hote hain (addition)...",
                "To decryption me process reverse hoga.",
                "ASCII table me peeche jaane ke liye subtraction use hota hai."
            ],
            successMessage: "CIPHER RESTORED — DATA FLOW STABLE HO GAYA",
            failureHint: "Galat logic. Addition se encryption aur badh raha hai. Hume reverse jaana hai.",
            answer: "encryptedChar - shiftOffset",
            options: [
                "encryptedChar + shiftOffset",
                "encryptedChar % shiftOffset",
                "encryptedChar - shiftOffset",
                "encryptedChar / shiftOffset"
            ]
        }
    },
    level4: {
        cyber: {
            title: "LEVEL 4 — SYSTEM OVERRIDE",
            context: "OBLIVION is actively fighting back and blocking our intrusion. The firewall evaluates mathematical logic dynamically.",
            problem: "Write an algorithm that calculates and outputs the sum of all integers from 1 to 50. The firewall requires the exact numeric output to stabilize the connection.",
            templates: {
                cpp: "#include <iostream>\nusing namespace std;\n\nint main() {\n    // Calculate sum from 1 to 50 and print it\n    \n    return 0;\n}",
                python: "def calculate_sum():\n    # Calculate sum from 1 to 50 and print it\n    pass\n\ncalculate_sum()",
                javascript: "function calculateSum() {\n    // Calculate sum from 1 to 50 and print it\n}\n\ncalculateSum();",
                c: "#include <stdio.h>\n\nint main() {\n    // Calculate sum from 1 to 50 and print it\n    \n    return 0;\n}"
            },
            expectedOutput: "1275",
            tasks: [
                "Select a programming language",
                "Write the correct output generation logic",
                "Execute code to bypass the firewall"
            ],
            clues: [
                "The firewall strictly expects the exact numeric string.",
                "Ensure there are no extra spaces or formatting text in your output, just the number.",
                "You can use a simple loop to calculate the sum."
            ],
            successMessage: "SECURITY COMPUTATION ACCEPTED — FIREWALL BYPASSED",
            failureHint: "Output mismatch. The firewall rejected your computation."
        },
        dev: {
            title: "LEVEL 4 — LOGIC RECONSTRUCTION",
            context: "OBLIVION destroyed the core logic router. The algorithm required to reconstruct it is a sequence generator.",
            problem: "Write an algorithm to calculate and print the 10th term of the Fibonacci sequence (assuming F1=0, F2=1, F3=1, etc.).",
            templates: {
                cpp: "#include <iostream>\nusing namespace std;\n\nint main() {\n    // Print the 10th Fibonacci number\n    \n    return 0;\n}",
                python: "def get_fibonacci():\n    # Print the 10th Fibonacci number\n    pass\n\nget_fibonacci()",
                javascript: "function getFibonacci() {\n    // Print the 10th Fibonacci number\n}\n\ngetFibonacci();",
                c: "#include <stdio.h>\n\nint main() {\n    // Print the 10th Fibonacci number\n    \n    return 0;\n}"
            },
            expectedOutput: "34",
            tasks: [
                "Select your preferred language",
                "Write the algorithm to print the exact required number",
                "Compile and Run to validate the logic"
            ],
            clues: [
                "The system is case-sensitive.",
                "F1=0, F2=1, F3=1, F4=2, F5=3, F6=5...",
                "Use the standard output/print function of your chosen language to print ONLY the 10th number."
            ],
            successMessage: "LOGIC ROUTER ONLINE — AUTHENTICATION RESTORED",
            failureHint: "System fault. The output sequence does not match the expected router key."
        }
    }
};
