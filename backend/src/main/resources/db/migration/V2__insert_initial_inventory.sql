-- Initialdaten: Inventar aus Norberts Liste (Legacy: "Norberts DB/inventory_qr.sql")
-- Diese Datei wurde per Skript erzeugt, nicht von Hand geschrieben.
--
-- Stand der Liste unbekannt, noch NICHT mit Betreuer bzw. Equipment.xlsx abgeglichen.
-- Unterkategorien mit "-- abgeleitet" hatten in der Liste keinen Namen und wurden aus den Geräten abgeleitet.
-- Korrekturen NICHT hier, sondern als neue Migration (V3, V4, ...).

-- ===== Kategorien =====
INSERT INTO categories (id, code, name) VALUES
    (1, '01', 'Lichttechnik'),
    (2, '02', 'Kamera'),
    (3, '03', 'Audio'),
    (4, '04', 'Stativ & Support'),
    (5, '05', 'Gimbal'),
    (6, '06', 'Batterien'),
    (7, '07', 'Zubehör');

-- ===== Unterkategorien =====
INSERT INTO subcategories (id, category_id, code, name) VALUES
    (1, 1, '01', 'Dauerlicht'),
    (2, 1, '02', 'Blitze'),
    (3, 1, '03', 'Lichtmessgeräte'),
    (4, 1, '04', 'Funkauslöser'),
    (5, 1, '05', 'UV-Licht'),
    (6, 1, '06', 'Lichtformer'),
    (7, 2, '01', 'Kameras'),
    (8, 2, '02', 'Objektive'),
    (9, 2, '03', 'Objektivzubehör'),
    (10, 3, '01', 'Funkmikrofone'), -- abgeleitet
    (11, 3, '02', 'Kameramikrofone'), -- abgeleitet
    (12, 3, '03', 'Studiomikrofone'), -- abgeleitet
    (13, 3, '04', 'Audiorecorder'), -- abgeleitet
    (14, 3, '05', 'Kopfhörer'), -- abgeleitet
    (15, 3, '06', 'Audiozubehör'), -- abgeleitet
    (16, 3, '07', 'Sonstiges Audio'), -- abgeleitet
    (17, 4, '01', 'Kamerastative'), -- abgeleitet
    (18, 4, '02', 'Stativzubehör'), -- abgeleitet
    (19, 4, '03', 'Lichtstative'), -- abgeleitet
    (20, 4, '04', 'Audiostative'), -- abgeleitet
    (21, 4, '05', 'Ministative'), -- abgeleitet
    (22, 4, '06', 'Sonstiger Support'), -- abgeleitet
    (23, 5, '01', 'Smartphone-Gimbals'), -- abgeleitet
    (24, 5, '02', 'Kamera-Gimbals'), -- abgeleitet
    (25, 5, '03', 'Schwebestative'), -- abgeleitet
    (26, 5, '04', 'Gimbal-Zubehör'), -- abgeleitet
    (27, 6, '01', 'Videokamera-Akkus'), -- abgeleitet
    (28, 6, '02', 'Canon-Akkus'), -- abgeleitet
    (29, 7, '01', 'Drucker'), -- abgeleitet
    (30, 7, '02', 'Hintergründe'), -- abgeleitet
    (31, 7, '03', 'Studiozubehör'), -- abgeleitet
    (32, 7, '04', 'Sonstiges'); -- abgeleitet

-- ===== Produkte =====
INSERT INTO products (id, subcategory_id, code, name) VALUES
    (1, 1, '0001', 'Godox SL-150W'),
    (2, 1, '0002', 'Godox MS300'),
    (3, 1, '0003', 'Godox SK400'),
    (4, 1, '0004', 'Godox SL60W'),
    (5, 1, '0005', 'ARRI 750 Plus'),
    (6, 1, '0006', 'Elinchrom D-Lite 4'),
    (7, 1, '0007', 'Elinchrom D-Lite 2 IT'),
    (8, 1, '0008', 'Tecpro Liteflex Bicolor'),
    (9, 1, '0009', 'Litemons LED 6R'),
    (10, 1, '0010', 'LiteRing Set'),
    (11, 1, '0011', 'OSRAM SLG 1000'),
    (12, 1, '0012', 'Hedler C10 Set'),
    (13, 1, '0013', 'Hedler Systemlicht 1000W Set'),
    (14, 2, '0001', 'Canon Speedlite 580EX'),
    (15, 3, '0001', 'Gossen DIGIPRO F2'),
    (16, 4, '0001', 'Godox XPRO II C'),
    (17, 4, '0002', 'Elinchrom EL-Skyport Set'),
    (18, 5, '0001', 'UV Lampe 80W'),
    (19, 6, '0001', 'Elinchrom Portalite 50x50'),
    (20, 6, '0002', 'Elinchrom Portalite 60x60'),
    (21, 6, '0003', 'Elinchrom Rotalux 135x50'),
    (22, 6, '0004', 'Godox 160x30'),
    (23, 6, '0005', 'Godox 75'),
    (24, 6, '0006', 'Neewer 75'),
    (25, 6, '0007', 'Diffuser 40'),
    (26, 6, '0008', 'Diffuser 45'),
    (27, 6, '0009', 'Elinchrom Round Grid Set'),
    (28, 7, '0001', 'DJI Osmo'),
    (29, 7, '0002', 'Sony RX0 II Set'),
    (30, 7, '0003', 'Sony HDV Handycam'),
    (31, 7, '0004', 'Canon EOS 5D Mark III'),
    (32, 7, '0005', 'Canon EOS 6D Mark II'),
    (33, 7, '0006', 'Sony PXW-Z150 Set'),
    (34, 7, '0007', 'Panasonic AG-AC90EJ'),
    (35, 7, '0008', 'Sony NXCAM NX800'),
    (36, 7, '0009', 'Sony FX30 Set'),
    (37, 7, '0010', 'Canon EOS R10'),
    (38, 8, '0001', 'Canon 24–105mm f4'),
    (39, 8, '0002', 'Sony 24–105mm f4'),
    (40, 8, '0003', 'Canon 100mm f2.8'),
    (41, 8, '0004', 'Canon 50mm f2.5'),
    (42, 8, '0005', 'Canon 18–150mm'),
    (43, 9, '0001', 'ND Filter 77mm'),
    (44, 10, '0001', 'DJI Mic 2'),
    (45, 10, '0002', 'AKG Perception Wireless 45 Set'),
    (46, 11, '0001', 'Rode VideoMic'),
    (47, 11, '0002', 'Rode NTG4 Set'),
    (48, 12, '0001', 'Rode NT-USB Set'),
    (49, 12, '0002', 'AKG C1000S'),
    (50, 12, '0003', 'AKG C480B'),
    (51, 12, '0004', 'Behringer C3000B'),
    (52, 12, '0005', 'Behringer C-2 Set'),
    (53, 12, '0006', 'The T.Bone HeadMike-D'),
    (54, 13, '0001', 'Zoom H5'),
    (55, 13, '0002', 'Zoom H6'),
    (56, 14, '0001', 'Beyerdynamic DT770 M'),
    (57, 14, '0002', 'Sennheiser HD206'),
    (58, 14, '0003', 'Grundig GDHS215'),
    (59, 15, '0001', 'Rycote Classic Softie Kit'),
    (60, 15, '0002', 'XLR Kabel 10m'),
    (61, 15, '0003', 'Mikrofonschirm'),
    (62, 15, '0004', 'Zoom Recorder Zubehör Set'),
    (63, 16, '0001', 'Phonic Celseus 200'),
    (64, 17, '0001', 'Sachtler Ace M'),
    (65, 17, '0002', 'CAM GEAR Mark 6'),
    (66, 17, '0003', 'Manfrotto 290'),
    (67, 17, '0004', 'Manfrotto 190XPROB'),
    (68, 17, '0005', 'Manfrotto 190CL'),
    (69, 17, '0006', 'Manfrotto 501'),
    (70, 18, '0001', 'Manfrotto 114MV'),
    (71, 18, '0002', 'Manfrotto 127'),
    (72, 19, '0001', 'Lichtstativ klein'),
    (73, 19, '0002', 'Bresser Stativ'),
    (74, 19, '0003', 'ARRI 050MKA'),
    (75, 19, '0004', 'Lichtstativ groß'),
    (76, 19, '0005', 'Manfrotto 420B'),
    (77, 20, '0001', 'Audio-Stativ groß'),
    (78, 20, '0002', 'Rode Tonangel groß'),
    (79, 20, '0003', 'Rode Tonangel klein'),
    (80, 21, '0001', 'Yunteng Mini Stativ'),
    (81, 21, '0002', 'Giottos LC325 Set'),
    (82, 22, '0001', 'Showstand 1 Alu Set'),
    (83, 22, '0002', 'Gerüst'),
    (84, 23, '0001', 'DJI Osmo Mobile SE'),
    (85, 23, '0002', 'DJI Osmo Mobile'),
    (86, 24, '0001', 'DJI Ronin-S'),
    (87, 25, '0001', 'Glidecam HD-2000'),
    (88, 26, '0001', 'Zubehörgewichte'),
    (89, 27, '0001', 'Hedbox RP-NPF970'),
    (90, 27, '0002', 'Sony NP-F770'),
    (91, 27, '0003', 'Sony NP-F730'),
    (92, 27, '0004', 'Sony NP-F720'),
    (93, 27, '0005', 'Sony NP-FZ100'),
    (94, 27, '0006', 'Sony BP-U70'),
    (95, 27, '0007', 'Sony BP-U35'),
    (96, 27, '0008', 'DJI HB01-522365'),
    (97, 28, '0001', 'Canon LP-E17'),
    (98, 28, '0002', 'Powerextra LP-E6'),
    (99, 29, '0001', 'HP DeskJet 3630'),
    (100, 29, '0002', 'HP 302XL Schwarz'),
    (101, 29, '0003', 'HP 302XL Dreifarbig'),
    (102, 29, '0004', 'HP Drucker Zubehörbox'),
    (103, 30, '0001', 'Blue-Screen-Stoff'),
    (104, 30, '0002', 'Green-Screen-Stoff'),
    (105, 31, '0001', 'Filmklappe'),
    (106, 31, '0002', 'Reflektorpanel'),
    (107, 31, '0003', 'ColorChecker'),
    (108, 31, '0004', 'Farbfolien'),
    (109, 31, '0005', 'Fotobox'),
    (110, 31, '0006', 'Puppe'),
    (111, 32, '0001', 'Kunstpflanze'),
    (112, 32, '0002', 'Kabelrolle 10m'),
    (113, 32, '0003', 'Baustrahler'),
    (114, 32, '0004', 'Holzstück'),
    (115, 32, '0005', 'LaCie Rugged'),
    (116, 32, '0006', 'SanDisk 2TB');

-- ===== Exemplare =====
INSERT INTO equipment_items (product_id, inventory_number) VALUES
    (1, '01010001'), -- Godox SL-150W
    (2, '01010002'), -- Godox MS300 /1
    (2, '01010003'), -- Godox MS300 /2
    (3, '01010004'), -- Godox SK400 /1
    (3, '01010005'), -- Godox SK400 /2
    (4, '01010006'), -- Godox SL60W
    (5, '01010007'), -- ARRI 750 Plus /1
    (5, '01010008'), -- ARRI 750 Plus /2
    (6, '01010009'), -- Elinchrom D-Lite 4 /1
    (6, '01010010'), -- Elinchrom D-Lite 4 /2
    (7, '01010011'), -- Elinchrom D-Lite 2 IT /1
    (7, '01010012'), -- Elinchrom D-Lite 2 IT /2
    (8, '01010013'), -- Tecpro Liteflex Bicolor /1
    (8, '01010014'), -- Tecpro Liteflex Bicolor /2
    (8, '01010015'), -- Tecpro Liteflex Bicolor /3
    (9, '01010016'), -- Litemons LED 6R /1
    (9, '01010017'), -- Litemons LED 6R /2
    (9, '01010018'), -- Litemons LED 6R /3
    (10, '01010019'), -- LiteRing Set
    (11, '01010020'), -- OSRAM SLG 1000
    (12, '01010021'), -- Hedler C10 Set
    (13, '01010022'), -- Hedler Systemlicht 1000W Set
    (14, '01020001'), -- Canon Speedlite 580EX
    (15, '01030001'), -- Gossen DIGIPRO F2
    (16, '01040001'), -- Godox XPRO II C
    (17, '01040002'), -- Elinchrom EL-Skyport Set
    (18, '01050001'), -- UV Lampe 80W
    (19, '01060001'), -- Elinchrom Portalite 50x50
    (20, '01060002'), -- Elinchrom Portalite 60x60 /1
    (20, '01060003'), -- Elinchrom Portalite 60x60 /2
    (21, '01060004'), -- Elinchrom Rotalux 135x50
    (22, '01060005'), -- Godox 160x30
    (23, '01060006'), -- Godox 75
    (24, '01060007'), -- Neewer 75
    (25, '01060008'), -- Diffuser 40
    (26, '01060009'), -- Diffuser 45
    (27, '01060010'), -- Elinchrom Round Grid Set
    (28, '02010001'), -- DJI Osmo
    (29, '02010002'), -- Sony RX0 II Set
    (30, '02010003'), -- Sony HDV Handycam
    (31, '02010004'), -- Canon EOS 5D Mark III /1
    (31, '02010005'), -- Canon EOS 5D Mark III /2
    (32, '02010006'), -- Canon EOS 6D Mark II
    (33, '02010007'), -- Sony PXW-Z150 Set
    (34, '02010008'), -- Panasonic AG-AC90EJ /1
    (34, '02010009'), -- Panasonic AG-AC90EJ /2
    (35, '02010010'), -- Sony NXCAM NX800
    (36, '02010011'), -- Sony FX30 Set
    (37, '02010012'), -- Canon EOS R10 /1
    (37, '02010013'), -- Canon EOS R10 /2
    (37, '02010014'), -- Canon EOS R10 /3
    (37, '02010015'), -- Canon EOS R10 /4
    (38, '02020001'), -- Canon 24–105mm f4
    (39, '02020002'), -- Sony 24–105mm f4
    (40, '02020003'), -- Canon 100mm f2.8
    (41, '02020004'), -- Canon 50mm f2.5
    (42, '02020005'), -- Canon 18–150mm /1
    (42, '02020006'), -- Canon 18–150mm /2
    (42, '02020007'), -- Canon 18–150mm /3
    (42, '02020008'), -- Canon 18–150mm /4
    (43, '02030001'), -- ND Filter 77mm
    (44, '03010001'), -- DJI Mic 2 /1
    (44, '03010002'), -- DJI Mic 2 /2
    (45, '03010003'), -- AKG Perception Wireless 45 Set
    (46, '03020001'), -- Rode VideoMic /1
    (46, '03020002'), -- Rode VideoMic /2
    (47, '03020003'), -- Rode NTG4 Set
    (48, '03030001'), -- Rode NT-USB Set /1
    (48, '03030002'), -- Rode NT-USB Set /2
    (48, '03030003'), -- Rode NT-USB Set /3
    (48, '03030004'), -- Rode NT-USB Set /4
    (48, '03030005'), -- Rode NT-USB Set /5
    (48, '03030006'), -- Rode NT-USB Set /6
    (49, '03030007'), -- AKG C1000S
    (50, '03030008'), -- AKG C480B
    (51, '03030009'), -- Behringer C3000B
    (52, '03030010'), -- Behringer C-2 Set
    (53, '03030011'), -- The T.Bone HeadMike-D
    (54, '03040001'), -- Zoom H5
    (55, '03040002'), -- Zoom H6
    (56, '03050001'), -- Beyerdynamic DT770 M
    (57, '03050002'), -- Sennheiser HD206 /1
    (57, '03050003'), -- Sennheiser HD206 /2
    (58, '03050004'), -- Grundig GDHS215
    (59, '03060001'), -- Rycote Classic Softie Kit
    (60, '03060002'), -- XLR Kabel 10m /1
    (60, '03060003'), -- XLR Kabel 10m /2
    (61, '03060004'), -- Mikrofonschirm
    (62, '03060005'), -- Zoom Recorder Zubehör Set
    (63, '03070001'), -- Phonic Celseus 200
    (64, '04010001'), -- Sachtler Ace M /1
    (64, '04010002'), -- Sachtler Ace M /2
    (65, '04010003'), -- CAM GEAR Mark 6
    (66, '04010004'), -- Manfrotto 290
    (67, '04010005'), -- Manfrotto 190XPROB
    (68, '04010006'), -- Manfrotto 190CL
    (69, '04010007'), -- Manfrotto 501
    (70, '04020001'), -- Manfrotto 114MV
    (71, '04020002'), -- Manfrotto 127
    (72, '04030001'), -- Lichtstativ klein /1
    (72, '04030002'), -- Lichtstativ klein /2
    (72, '04030003'), -- Lichtstativ klein /3
    (72, '04030004'), -- Lichtstativ klein /4
    (72, '04030005'), -- Lichtstativ klein /5
    (72, '04030006'), -- Lichtstativ klein /6
    (72, '04030007'), -- Lichtstativ klein /7
    (73, '04030008'), -- Bresser Stativ /1
    (73, '04030009'), -- Bresser Stativ /2
    (73, '04030010'), -- Bresser Stativ /3
    (74, '04030011'), -- ARRI 050MKA /1
    (74, '04030012'), -- ARRI 050MKA /2
    (74, '04030013'), -- ARRI 050MKA /3
    (74, '04030014'), -- ARRI 050MKA /4
    (74, '04030015'), -- ARRI 050MKA /5
    (75, '04030016'), -- Lichtstativ groß /1
    (75, '04030017'), -- Lichtstativ groß /2
    (76, '04030018'), -- Manfrotto 420B
    (77, '04040001'), -- Audio-Stativ groß /1
    (77, '04040002'), -- Audio-Stativ groß /2
    (78, '04040003'), -- Rode Tonangel groß
    (79, '04040004'), -- Rode Tonangel klein
    (80, '04050001'), -- Yunteng Mini Stativ
    (81, '04050002'), -- Giottos LC325 Set
    (82, '04060001'), -- Showstand 1 Alu Set
    (83, '04060002'), -- Gerüst
    (84, '05010001'), -- DJI Osmo Mobile SE /1
    (84, '05010002'), -- DJI Osmo Mobile SE /2
    (84, '05010003'), -- DJI Osmo Mobile SE /3
    (84, '05010004'), -- DJI Osmo Mobile SE /4
    (84, '05010005'), -- DJI Osmo Mobile SE /5
    (85, '05010006'), -- DJI Osmo Mobile
    (86, '05020001'), -- DJI Ronin-S
    (87, '05030001'), -- Glidecam HD-2000
    (88, '05040001'), -- Zubehörgewichte
    (89, '06010001'), -- Hedbox RP-NPF970 /1
    (89, '06010002'), -- Hedbox RP-NPF970 /2
    (89, '06010003'), -- Hedbox RP-NPF970 /3
    (89, '06010004'), -- Hedbox RP-NPF970 /4
    (90, '06010005'), -- Sony NP-F770
    (91, '06010006'), -- Sony NP-F730 /1
    (91, '06010007'), -- Sony NP-F730 /2
    (92, '06010008'), -- Sony NP-F720
    (93, '06010009'), -- Sony NP-FZ100 /1
    (93, '06010010'), -- Sony NP-FZ100 /2
    (94, '06010011'), -- Sony BP-U70
    (95, '06010012'), -- Sony BP-U35
    (96, '06010013'), -- DJI HB01-522365
    (97, '06020001'), -- Canon LP-E17 /1
    (97, '06020002'), -- Canon LP-E17 /2
    (97, '06020003'), -- Canon LP-E17 /3
    (97, '06020004'), -- Canon LP-E17 /4
    (98, '06020005'), -- Powerextra LP-E6 /1
    (98, '06020006'), -- Powerextra LP-E6 /2
    (99, '07010001'), -- HP DeskJet 3630 /1
    (99, '07010002'), -- HP DeskJet 3630 /2
    (100, '07010003'), -- HP 302XL Schwarz
    (101, '07010004'), -- HP 302XL Dreifarbig
    (102, '07010005'), -- HP Drucker Zubehörbox
    (103, '07020001'), -- Blue-Screen-Stoff
    (104, '07020002'), -- Green-Screen-Stoff
    (105, '07030001'), -- Filmklappe
    (106, '07030002'), -- Reflektorpanel
    (107, '07030003'), -- ColorChecker
    (108, '07030004'), -- Farbfolien
    (109, '07030005'), -- Fotobox
    (110, '07030006'), -- Puppe
    (111, '07040001'), -- Kunstpflanze
    (112, '07040002'), -- Kabelrolle 10m
    (113, '07040003'), -- Baustrahler
    (114, '07040004'), -- Holzstück
    (115, '07040005'), -- LaCie Rugged
    (116, '07040006'); -- SanDisk 2TB
