package tn.gov.ms.sidra.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import tn.gov.ms.sidra.entity.PatientAccess;
import tn.gov.ms.sidra.entity.User;
import tn.gov.ms.sidra.entity.Patient;

import java.util.List;
import java.util.Optional;

@Repository
public interface PatientAccessRepository extends JpaRepository<PatientAccess, Long> {

    List<PatientAccess> findByRequestorOrderByDateCreationDesc(User requestor);

    List<PatientAccess> findByOwnerOrderByDateCreationDesc(User owner);

    @Query("SELECT pa FROM PatientAccess pa WHERE pa.patient.id = :patientId AND pa.requestor.id = :requestorId AND pa.status = 'APPROVED'")
    Optional<PatientAccess> findApprovedAccess(@Param("patientId") Long patientId, @Param("requestorId") Long requestorId);

    @Query("SELECT pa FROM PatientAccess pa WHERE pa.patient.id = :patientId AND pa.requestor.id = :requestorId AND pa.status = 'PENDING'")
    Optional<PatientAccess> findPendingAccess(@Param("patientId") Long patientId, @Param("requestorId") Long requestorId);

    @Query("SELECT pa FROM PatientAccess pa WHERE pa.patient.id = :patientId AND pa.requestor.id = :requestorId")
    Optional<PatientAccess> findByPatientAndRequestor(@Param("patientId") Long patientId, @Param("requestorId") Long requestorId);

    @Query("SELECT COUNT(pa) > 0 FROM PatientAccess pa WHERE pa.patient = :patient AND pa.requestor = :requestor AND pa.status = 'APPROVED'")
    boolean hasAccess(@Param("patient") Patient patient, @Param("requestor") User requestor);
}