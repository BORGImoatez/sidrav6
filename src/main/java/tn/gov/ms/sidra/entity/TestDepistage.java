package tn.gov.ms.sidra.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "tests_depistage")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TestDepistage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "formulaire_id")
    private Formulaire formulaire;

    @Column(name = "type_test")
    @Enumerated(EnumType.STRING)
    private TypeTest typeTest;

    @Column(name = "realise")
    private Boolean realise;

    @Column(name = "periode")
    private String periode;

    public enum TypeTest {
        VIH,
        VHC,
        VHB,
        SYPHILIS
    }
}