package tn.gov.ms.sidra.entity;

public enum TypeStructure {
    PUBLIQUE("Publique"),
    PRIVEE("Privée"),
    ONG("ONG");

    private final String label;

    TypeStructure(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }
}