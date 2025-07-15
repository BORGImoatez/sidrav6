package tn.gov.ms.sidra.entity;

public enum OtpEtat {
    VALIDE("Valide"),
    EXPIRE("Expiré"),
    UTILISE("Utilisé"),
    BLOQUE("Bloqué");

    private final String label;

    OtpEtat(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }
}