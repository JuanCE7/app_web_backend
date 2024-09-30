export class Usecase {
    id: string;
    displayId: string;
    name: string;
    description: string;
    entries: string[];
    preconditions: string[];
    postconditions: string[];
    mainFlow: string[];
    alternateFlows: string[];
    projectId: string;
    createdAt: Date;
    updatedAt: Date;    // Condiciones posteriores (opcional)
  
    constructor(
        id: string,
        displayId: string,
        name: string,
        description: string,
        entries?: string[],
        preconditions?: string[],
        postconditions?: string[],
        mainFlow?: string[],
        alternateFlows?: string[],
        projectId?: string,
        createdAt?: Date,
        updatedAt?: Date
    ) {
      this.id = id;
      this.displayId = displayId;
      this.name = name;
      this.description = description;
      this.entries = entries;
      this.preconditions = preconditions;
      this.mainFlow = mainFlow;
      this.preconditions = preconditions;
      this.postconditions = postconditions;
      this.alternateFlows = alternateFlows;
      this.projectId = projectId;
      this.createdAt = createdAt;
      this.updatedAt = updatedAt;
    }
  }