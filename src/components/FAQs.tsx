


export default function FAQs() {
    return (
        <section className="scroll-py-16 py-16 md:scroll-py-32 md:py-32">
            <div className="mx-auto max-w-5xl px-6">
                <div className="grid gap-y-12 px-2 lg:[grid-template-columns:1fr_auto]">
                    <div className="text-center lg:text-left">
                        <h2 className="mb-4 text-3xl font-semibold md:text-4xl">
                        Questions fréquentes sur <br className="hidden lg:block" /> L'ASEEST/D <br className="hidden lg:block" />
                            
                        </h2>
                        <p>Vous avez des questions sur l'ASEEST/D ? Retrouvez ici les réponses aux interrogations les plus courantes concernant notre association, l'adhésion, nos activités et les services que nous proposons à la communauté des élèves, étudiants et stagiaires tchadiens de Douala.</p>
                    </div>

                    <div className="divide-y divide-dashed sm:mx-auto sm:max-w-lg lg:mx-0">
                        <div className="pb-6">
                            <h3 className="font-medium">Quelles activités l'ASEEST/D organise-t-elle ?</h3>
                            <p className="text-muted-foreground mt-4">L'association organise tout au long de l'année des 
                                journées d'intégration, des conférences, des formations, des activités culturelles,
                                 des compétitions sportives, des actions de solidarité, 
                                ainsi que des rencontres avec les autorités et les partenaires..</p>

                            {/* <ol className="list-outside list-decimal space-y-2 pl-4">
                                <li className="text-muted-foreground mt-4">To request a refund, please contact our support team with your order number and reason for the refund.</li>
                                <li className="text-muted-foreground mt-4">Refunds will be processed within 3-5 business days.</li>
                                <li className="text-muted-foreground mt-4">Please note that refunds are only available for new customers and are limited to one per customer.</li>
                            </ol> */}
                        </div>
                        <div className="py-6">
                            <h3 className="font-medium">L'ASEEST/D est-elle une association reconnue ?</h3>
                            <p className="text-muted-foreground mt-4">Oui. L'ASEEST/D est une association à but non lucratif, reconnue par les autorités compétentes de l'État du Cameroun ainsi que par le Consulat Général de la République du Tchad à Douala. Elle œuvre dans le respect des lois et des valeurs de solidarité, de fraternité et d'excellence.</p>
                        </div>
                        <div className="py-6">
                            <h3 className="font-medium">Qui peut adhérer à l'ASEEST/D ?</h3>
                            <p className="text-muted-foreground mt-4">Toute personne de nationalité tchadienne résidant à Douala et ayant le statut d'élève, d'étudiant ou de stagiaire peut demander son adhésion à l'ASEEST/D, sous réserve de respecter les statuts et le règlement intérieur de l'association.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}