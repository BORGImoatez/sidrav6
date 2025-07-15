package tn.gov.ms.sidra.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "structures")
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Structure {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Le nom de la structure est obligatoire")
    @Column(nullable = false)
    private String nom;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TypeStructure type;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "gouvernorat_id", nullable = false)
    @JsonIgnoreProperties({"structures", "delegations"})
    private Gouvernorat gouvernorat;

    @Column(nullable = false)
    private String secteur;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ministere_id")
    @JsonIgnoreProperties({"structures"})
    private Ministere ministere;

    private String adresse;

    private String telephone;

    @Column(nullable = false)
    private Boolean actif = true;

    @Column(name = "date_creation", nullable = false)
    private LocalDateTime dateCreation;

    @OneToMany(mappedBy = "structure", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnoreProperties({"structure"})
    private List<User> utilisateurs;

    @PrePersist
    protected void onCreate() {
        dateCreation = LocalDateTime.now();
    }
}