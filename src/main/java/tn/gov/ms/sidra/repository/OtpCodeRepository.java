package tn.gov.ms.sidra.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import tn.gov.ms.sidra.entity.OtpCode;
import tn.gov.ms.sidra.entity.OtpEtat;
import tn.gov.ms.sidra.entity.User;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface OtpCodeRepository extends JpaRepository<OtpCode, Long> {

    Optional<OtpCode> findByUserAndCodeAndEtat(User user, String code, OtpEtat etat);

    List<OtpCode> findByUserAndEtatOrderByDateCreationDesc(User user, OtpEtat etat);

    Optional<OtpCode> findFirstByUserAndEtatOrderByDateCreationDesc(User user, OtpEtat etat);

    @Modifying
    @Query("UPDATE OtpCode o SET o.etat = :nouvelEtat WHERE o.user = :user AND o.etat = :ancienEtat")
    void updateEtatByUserAndEtat(@Param("user") User user, 
                                @Param("ancienEtat") OtpEtat ancienEtat, 
                                @Param("nouvelEtat") OtpEtat nouvelEtat);

    @Modifying
    @Query("UPDATE OtpCode o SET o.etat = 'EXPIRE' WHERE o.dateExpiration < :now AND o.etat = 'VALIDE'")
    void expireOldCodes(@Param("now") LocalDateTime now);

    @Query("SELECT COUNT(o) FROM OtpCode o WHERE o.user = :user AND o.dateCreation > :since")
    long countByUserAndDateCreationAfter(@Param("user") User user, @Param("since") LocalDateTime since);

    void deleteByUserAndEtat(User user, OtpEtat etat);
}