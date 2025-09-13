# 🛫 Amadeus Booking Steps

This guide explains how to use **Amadeus commands** to book flights locally (domestic) and internationally, for single or multiple passengers.

---

## 🔹 Step 1. Passenger Name Entry (NM)

**Single passenger:**
```bash
NM1ALIYU/HAKEEM MR
```

**Multiple passengers (increment number at start):**
```bash
NM2ALIYU/HAKEEM MR/GRACE MRS
```

👉 Always enter surname first, then first name, followed by title (`MR`, `MRS`, `MS`, `CHD`, `INF`).

---

## 🔹 Step 2. Flight Availability (AN)

**Syntax:**
```bash
AN<date><origin><destination>
```

**Local example (Lagos → Abuja):**
```bash
AN15OCTLOSABV
```

**International example (Lagos → Milan):**
```bash
AN15OCTLOSMIL
```

👉 This displays available flights for that route/date.  
*(Use IATA airport codes — LOS = Lagos, ABV = Abuja, MIL = Milan, etc.)*

---

## 🔹 Step 3. Display Available Airlines

- Just **press ENTER** after `AN` entry to see schedules & carriers.  
- Use IATA airline code lists for reference.

---

## 🔹 Step 4. Seat Sell (SS)

**Syntax:**
```bash
SS<line><class><#PAX>
```

**Example for 1 passenger in Y class on flight option 2:**
```bash
SS2Y1
```

**Example for 2 passengers:**
```bash
SS2Y2
```

👉 `"Y"` = Economy. Replace with `J`, `C`, `F` for Business/First class if available.

---

## 🔹 Step 5. Contact & Address (AP / CTCM / CTCE / CTCR)

**AP → Company or agent address:**
```bash
AP LAGOS NIGERIA +2341456789
```

**CTCM → Passenger mobile:**
```bash
CTCM+2348031234567
```

**CTCE → Passenger email:**
```bash
CTCE/ALIYU.HAKEEM@GMAIL.COM
```

**CTCR → Customer refusal to provide contact:**
```bash
CTCR
```

---

## 🔹 Step 6. Ticketing Time Limit (TK)

**Immediate ticketing:**
```bash
TKOK
```

**Specific deadline (e.g., 12th Oct):**
```bash
TKTL12OCT
```

---

## 🔹 Step 7. Remarks (RFA)

**Add initials/office remark:**
```bash
RFAHKT
```

---

## 🔹 Step 8. Pricing (FXP)

**Price the itinerary:**
```bash
FXP
```

👉 Returns fare quote based on availability.

---

## 🔹 Step 9. End Transaction (ER)

**Save and end reservation:**
```bash
ER
```

---

## 🔹 Step 10. Ignore (IG)

**Exit without saving:**
```bash
IG
```

---

# ✅ Putting It All Together

### A. Local Flight — 1 Passenger (LOS → ABV, Oct 15)
```bash
NM1ALIYU/HAKEEM MR
AN15OCTLOSABV
SS2Y1
AP LAGOS NIGERIA +2341456789
CTCM+2348031234567
CTCE/ALIYU.HAKEEM@GMAIL.COM
TKOK
RFAHKT
FXP
ER
```

---

### B. International Flight — 1 Passenger (LOS → MIL, Oct 15)
```bash
NM1ALIYU/HAKEEM MR
AN15OCTLOSMIL
SS2Y1
AP LAGOS NIGERIA +2341456789
CTCM+2348031234567
CTCE/ALIYU.HAKEEM@GMAIL.COM
TKOK
RFAHKT
FXP
ER
```

---

### C. Local Flight — 2 Passengers (LOS → ABV, Oct 15)
```bash
NM2ALIYU/HAKEEM MR/GRACE MRS
AN15OCTLOSABV
SS3Y2
AP LAGOS NIGERIA +2341456789
CTCM+2348031234567
CTCE/ALIYU.HAKEEM@GMAIL.COM
TKOK
RFAHKT
FXP
ER
```

---

## 📌 Notes
- Always verify **IATA codes** for airports and airlines.  
- Ensure passenger data matches passport/ID.  
- Ticketing deadlines (`TKTL`) are critical — missing them may cancel the booking.  
- Use `IG` to ignore and exit without saving.  
