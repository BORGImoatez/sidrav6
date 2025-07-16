package tn.gov.ms.sidra.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import tn.gov.ms.sidra.entity.User;
import tn.gov.ms.sidra.entity.UserRole;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    Optional<User> findByTelephone(String telephone);

    @Query("SELECT u FROM User u  WHERE u.id = :id")
    Optional<User> findByIdWithStructure(@Param("id") Long id);

    boolean existsByEmail(String email);

    boolean existsByTelephone(String telephone);

    List<User> findByActifTrue();

    List<User> findByRole(UserRole role);

    @Query("SELECT u FROM User u WHERE u.structure.id = :structureId")
    List<User> findByStructureId(@Param("structureId") Long structureId);

    @Query("SELECT u FROM User u WHERE u.actif = true AND u.structure.id = :structureId")
    List<User> findActiveUsersByStructureId(@Param("structureId") Long structureId);

    @Query("SELECT COUNT(u) FROM User u WHERE u.actif = true")
    long countActiveUsers();

    @Query("SELECT COUNT(u) FROM User u WHERE u.role = :role")
    long countUsersByRole(@Param("role") UserRole role);
}