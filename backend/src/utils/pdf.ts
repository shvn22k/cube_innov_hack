import fs from 'fs';
import PDFDocument from 'pdfkit';
import { IRoadmap } from '@models/roadmap.model'; // Adjust the path if needed

const generatePDF = async (roadmap: IRoadmap, outputPath: string) => {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument();

        const stream = fs.createWriteStream(outputPath);
        doc.pipe(stream);

        // Title
        doc
            .fontSize(20)
            .text(`Career Roadmap: ${roadmap.career}`, { align: 'center' })
            .moveDown();

        // Summary
        doc
            .fontSize(14)
            .text('Summary:', { underline: true })
            .moveDown(0.5)
            .fontSize(12)
            .text(roadmap.summary)
            .moveDown();

        // Stages
        doc
            .fontSize(14)
            .text('Stages:', { underline: true })
            .moveDown(0.5);
        roadmap.stages.forEach((stage, index) => {
            doc
                .fontSize(12)
                .text(`Stage ${index + 1}: ${stage.stage}`)
                .moveDown(0.2)
                .text(`Duration: ${stage.duration}`)
                .moveDown(0.2)
                .text(`Description: ${stage.description}`)
                .moveDown(0.2)
                .text(`Skills:`)
                .moveDown(0.2);

            stage.skills.forEach((skill) => {
                doc.text(`- ${skill}`, { indent: 20 });
            });

            doc.moveDown(0.2).text(`Resources:`);
            stage.resources.forEach((resource) => {
                doc.text(`- ${resource.name} (${resource.type}): ${resource.url}`, { indent: 20 });
            });

            doc.moveDown(0.2).text(`Projects:`);
            stage.projects.forEach((project) => {
                doc.text(`- ${project}`, { indent: 20 });
            });

            doc.moveDown();
        });

        // Job Roles
        doc
            .fontSize(14)
            .text('Job Roles:', { underline: true })
            .moveDown(0.5);
        roadmap.job_roles.forEach((role) => {
            doc.fontSize(12).text(`- ${role}`);
        });

        doc.moveDown();

        // Average Salary
        doc
            .fontSize(14)
            .text('Average Salary:', { underline: true })
            .moveDown(0.5);
        doc
            .fontSize(12)
            .text(`Entry Level: ${roadmap.average_salary.entry_level}`)
            .text(`Mid Level: ${roadmap.average_salary.mid_level}`)
            .text(`Senior Level: ${roadmap.average_salary.senior_level}`)
            .moveDown();

        // Next Steps
        doc
            .fontSize(14)
            .text('Next Steps:', { underline: true })
            .moveDown(0.5);
        roadmap.next_steps.forEach((step) => {
            doc.text(`- ${step}`);
        });

        doc.end();

        stream.on('finish', () => resolve(outputPath));
        stream.on('error', (error) => reject(error));
    });
};

export default generatePDF;
