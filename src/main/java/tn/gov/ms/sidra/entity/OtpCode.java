package tn.gov.ms.sidra.entity;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "otp_codes")
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class OtpCode {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnoreProperties({"structure", "authorities", "password", "username", "accountNonExpired", "accountNonLocked", "credentialsNonExpired", "enabled"})
    private User user;

    @Column(nullable = false, length = 6)
    private String code;

    @Column(name = "date_creation", nullable = false)
    private LocalDateTime dateCreation;

    @Column(name = "date_expiration", nullable = false)
    private LocalDateTime dateExpiration;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OtpEtat etat = OtpEtat.VALIDE;

    @Column(name = "nombre_tentatives", nullable = false)
    private Integer nombreTentatives = 0;

    @Column(name = "adresse_ip")
    private String adresseIp;

    @PrePersist
    protected void onCreate() {
        dateCreation = LocalDateTime.now();
    }

    public boolean isExpired() {
        return LocalDateTime.now().isAfter(dateExpiration);
    }

    public boolean isValid() {
        return etat == OtpEtat.VALIDE && !isExpired();
    }
}